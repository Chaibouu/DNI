import QRCode from "qrcode";
import crypto from "crypto";

/**
 * Génère un ID unique au format DNI-2025-XX23AB
 */
export function generateDniUniqueId(): string {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `DNI-${year}-${randomPart}`;
}

/**
 * Génère un QR code à partir des données du participant
 */
export async function generateQRCode(data: {
  uniqueId: string;
  participantId: string;
}): Promise<{ qrCode: string; qrCodeData: string }> {
  // Encoder les données en JSON pour le QR code
  const qrCodeData = JSON.stringify({
    id: data.participantId,
    uniqueId: data.uniqueId,
    timestamp: Date.now(),
  });

  // Générer le QR code en base64
  const qrCode = await QRCode.toDataURL(qrCodeData, {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 1,
    width: 300,
  });

  return {
    qrCode,
    qrCodeData,
  };
}

/**
 * Vérifie si un email est déjà enregistré pour l'événement DNI
 */
export async function isEmailAlreadyRegistered(email: string | undefined): Promise<boolean> {
  if (!email || email.trim() === "") {
    return false; // Pas d'email fourni, donc pas de conflit
  }
  const { db } = await import("@/lib/db");
  const participant = await db.dniParticipant.findFirst({
    where: { email },
  });
  return !!participant;
}

