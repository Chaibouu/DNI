import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { qrCodeData } = await req.json();

    if (!qrCodeData) {
      return NextResponse.json(
        { error: "Données QR code manquantes" },
        { status: 400 }
      );
    }

    // Parser les données du QR code
    let parsedData;
    try {
      parsedData = JSON.parse(qrCodeData);
    } catch (error) {
      return NextResponse.json(
        { error: "Format de données QR code invalide" },
        { status: 400 }
      );
    }

    const { participantId, uniqueId } = parsedData;

    if (!participantId || !uniqueId) {
      return NextResponse.json(
        { error: "Données QR code incomplètes" },
        { status: 400 }
      );
    }

    // Vérifier le participant dans la base de données
    const participant = await db.dniParticipant.findUnique({
      where: {
        id: participantId,
        uniqueId: uniqueId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Ticket non trouvé ou invalide" },
        { status: 404 }
      );
    }

    // Vérifier le statut
    if (participant.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Ce ticket a été annulé" },
        { status: 403 }
      );
    }

    // Si déjà check-in, retourner les informations
    if (participant.status === "CHECKED_IN") {
      return NextResponse.json({
        success: true,
        participant: {
          id: participant.id,
          uniqueId: participant.uniqueId,
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email,
          category: participant.category,
          status: participant.status,
          checkedInAt: participant.checkedInAt,
        },
        message: "Ce ticket a déjà été utilisé",
        alreadyCheckedIn: true,
      });
    }

    // Mettre à jour le statut à CHECKED_IN
    const updatedParticipant = await db.dniParticipant.update({
      where: { id: participant.id },
      data: {
        status: "CHECKED_IN",
        checkedInAt: new Date(),
        // checkedInBy pourrait être l'ID de l'admin qui scanne
      },
    });

    return NextResponse.json({
      success: true,
      participant: {
        id: updatedParticipant.id,
        uniqueId: updatedParticipant.uniqueId,
        firstName: updatedParticipant.firstName,
        lastName: updatedParticipant.lastName,
        email: updatedParticipant.email,
        category: updatedParticipant.category,
        status: updatedParticipant.status,
        checkedInAt: updatedParticipant.checkedInAt,
      },
      message: "Accès autorisé",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du ticket:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la vérification" },
      { status: 500 }
    );
  }
}

