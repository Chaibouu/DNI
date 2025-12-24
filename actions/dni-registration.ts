"use server";

import { db } from "@/lib/db";
import { DniRegistrationSchema } from "@/schemas";
import { generateDniUniqueId, generateQRCode, isEmailAlreadyRegistered } from "@/lib/dni-utils";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse, type ActionResponse } from "@/lib/response-utils";

/**
 * Action pour enregistrer un participant DNI
 */
export async function registerDniParticipant(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Extraction des données du formulaire
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email") || undefined,
      phone: formData.get("phone"),
      gender: formData.get("gender") || undefined,
      organisation: formData.get("organisation") || undefined,
      category: formData.get("category") || "ETUDIANT",
    };

    // Validation avec Zod
    const validatedFields = DniRegistrationSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const errors: Record<string, string> = {};
      validatedFields.error.errors.forEach((err) => {
        const field = err.path.join(".");
        errors[field] = err.message;
      });

      return createValidationErrorResponse(errors);
    }

    const validatedData = validatedFields.data;

    // Vérifier si l'email est déjà enregistré (seulement si un email est fourni)
    if (validatedData.email) {
      const emailExists = await isEmailAlreadyRegistered(validatedData.email);
      if (emailExists) {
        return createErrorResponse("Cet email est déjà enregistré pour l'événement");
      }
    }

    // Générer l'ID unique
    let uniqueId = generateDniUniqueId();
    let attempts = 0;
    
    // S'assurer que l'ID unique n'existe pas déjà
    while (attempts < 10) {
      const existing = await db.dniParticipant.findUnique({
        where: { uniqueId },
      });
      if (!existing) break;
      uniqueId = generateDniUniqueId();
      attempts++;
    }

    if (attempts >= 10) {
      return createErrorResponse("Erreur lors de la génération de l'ID unique. Veuillez réessayer.");
    }

    // Créer le participant
    const participant = await db.dniParticipant.create({
      data: {
        uniqueId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        gender: validatedData.gender || null,
        organisation: validatedData.organisation || null,
        category: validatedData.category,
        status: "PENDING",
        qrCode: null, // Sera mis à jour après génération
        qrCodeData: null, // Sera mis à jour après génération
      },
    });

    // Générer le QR code
    const { qrCode, qrCodeData } = await generateQRCode({
      uniqueId: participant.uniqueId,
      participantId: participant.id,
    });

    // Mettre à jour le participant avec le QR code
    const updatedParticipant = await db.dniParticipant.update({
      where: { id: participant.id },
      data: {
        qrCode,
        qrCodeData,
        status: "CONFIRMED",
      },
    });

    return createSuccessResponse(
      {
        participant: updatedParticipant,
        ticketUrl: `/dni/ticket/${updatedParticipant.id}`,
      },
      "Réservation réussie ! Votre ticket a été généré."
    );
  } catch (error: any) {
    console.error("Erreur lors de la réservation DNI:", error);
    
    // Gestion des erreurs spécifiques
    if (error?.code === "P2002") {
      // Erreur de contrainte unique (email ou uniqueId déjà existant)
      if (error?.meta?.target?.includes("email")) {
        return createErrorResponse("Cet email est déjà enregistré pour l'événement");
      }
      if (error?.meta?.target?.includes("uniqueId")) {
        return createErrorResponse("Erreur lors de la génération de l'ID unique. Veuillez réessayer.");
      }
    }
    
    // Message d'erreur générique avec plus de détails en développement
    const errorMessage = process.env.NODE_ENV === "development" 
      ? `Erreur: ${error?.message || "Erreur inconnue"}`
      : "Une erreur est survenue lors de la réservation. Veuillez réessayer.";
    
    return createErrorResponse(errorMessage);
  }
}

/**
 * Récupère les informations d'un participant par son ID
 */
export async function getDniParticipantById(participantId: string) {
  try {
    const participant = await db.dniParticipant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return createErrorResponse("Participant non trouvé");
    }

    return createSuccessResponse(participant);
  } catch (error) {
    console.error("Erreur lors de la récupération du participant:", error);
    return createErrorResponse("Erreur lors de la récupération des informations");
  }
}

/**
 * Récupère les informations d'un participant par son email
 */
export async function getDniParticipantByEmail(email: string) {
  try {
    const participant = await db.dniParticipant.findFirst({
      where: { email },
    });

    if (!participant) {
      return createErrorResponse("Aucun ticket trouvé pour cet email");
    }

    return createSuccessResponse(participant);
  } catch (error) {
    console.error("Erreur lors de la récupération du participant:", error);
    return createErrorResponse("Erreur lors de la récupération des informations");
  }
}

