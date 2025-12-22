import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { JwtPayload, TokenExpiredError } from "jsonwebtoken"; // Type du payload JWT
import { verify, sign } from "jsonwebtoken";
// Vérifier que les variables d'environnement sont définies
if (!process.env.RSA_PRIVATE_KEY) {
  throw new Error("RSA_PRIVATE_KEY n'est pas défini dans les variables d'environnement");
}
if (!process.env.RSA_PUBLIC_KEY) {
  throw new Error("RSA_PUBLIC_KEY n'est pas défini dans les variables d'environnement");
}
if (!process.env.AES_SECRET_KEY) {
  throw new Error("AES_SECRET_KEY n'est pas défini dans les variables d'environnement");
}

const privateKey = process.env.RSA_PRIVATE_KEY;
const publicKey = process.env.RSA_PUBLIC_KEY;
const aesSecretKey = Buffer.from(process.env.AES_SECRET_KEY, "hex");
const ALGORITHM = "RS256"; // Algorithme pour signer le JWT

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const tokenId = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Expiration dans 1 heure

  // Créer le payload pour le JWT
  const payload = {
    email,
    tokenId,
    expires: expires.toISOString(),
  };

  // Signer le JWT avec la clé privée RSA (RS256)
  const signedToken = sign(payload, privateKey, {
    algorithm: ALGORITHM,
    expiresIn: "1h", // Expire dans 1 heure
  });

  // Chiffrer le JWT signé avec AES-256-GCM
  const iv = crypto.randomBytes(12); // Générer un vecteur d'initialisation (IV) de 12 octets pour GCM
  // @ts-ignore: Unreachable code error
  const cipher = crypto.createCipheriv("aes-256-gcm", aesSecretKey, iv);

  let encrypted = cipher.update(signedToken, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64"); // Obtenir le tag d'authentification GCM

  // Combiner l'IV, l'authTag et le token chiffré dans un format sécurisé
  const encryptedToken = `${iv.toString("base64")}.${authTag}.${encrypted}`;

  // Supprimer l'ancien token s'il existe
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Stocker le token chiffré dans la base de données
  await db.passwordResetToken.create({
    data: {
      email,
      token: encryptedToken, // Stocker le token chiffré
      expires,
      tokenId,
    },
  });

  return encryptedToken;
};

export const verifyPasswordResetToken = async (encryptedToken: string) => {
  try {
    // Séparer les différentes parties du token chiffré
    const [ivBase64, authTagBase64, encryptedBase64] =
      encryptedToken.split(".");

    // Convertir en Buffer
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    // Déchiffrer le token avec AES-256-GCM
    // @ts-ignore: Unreachable code error
    const decipher = crypto.createDecipheriv("aes-256-gcm", aesSecretKey, iv);
    // @ts-ignore: Unreachable code error
    decipher.setAuthTag(authTag);

    // Déchiffrement du token
    let decrypted = Buffer.concat([
      // @ts-ignore: Unreachable code error
      decipher.update(encrypted),
      // @ts-ignore: Unreachable code error
      decipher.final(),
    ]);

    // Convertir le Buffer déchiffré en chaîne de caractères (UTF-8)
    const decryptedToken = decrypted.toString("utf8");

    // Vérifier le JWT déchiffré avec la clé publique RSA
    const decodedToken = verify(decryptedToken, publicKey, {
      algorithms: ["RS256"],
    });

    // Retourner le contenu du token si la vérification a réussi
    return { tokenPayload: decodedToken };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { error: "Token expiré" };
    } else {
      console.error("Erreur lors de la vérification du token :", error);
      return { error: "Token invalide" };
    }
  }
};

export const generateVerificationToken = async (email: string) => {
  const tokenId = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Expiration dans 1 heure

  // Créer le payload pour le JWT
  const payload = {
    email,
    tokenId,
    expires: expires.toISOString(),
  };

  // Signer le JWT avec la clé privée RSA (RS256)
  const signedToken = sign(payload, privateKey, {
    algorithm: ALGORITHM,
    expiresIn: "1h", // Expire dans 1 heure
  });

  // Chiffrer le JWT signé avec AES-256-GCM
  const iv = crypto.randomBytes(12); // Générer un vecteur d'initialisation (IV) de 12 octets pour GCM
  // @ts-ignore: Unreachable code error
  const cipher = crypto.createCipheriv("aes-256-gcm", aesSecretKey, iv);

  let encrypted = cipher.update(signedToken, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64"); // Obtenir le tag d'authentification GCM

  // Combiner l'IV, l'authTag et le token chiffré dans un format sécurisé
  const encryptedToken = `${iv.toString("base64")}.${authTag}.${encrypted}`;

  // Supprimer l'ancien token s'il existe
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Stocker le token chiffré dans la base de données
  await db.verificationToken.create({
    data: {
      email,
      token: encryptedToken, // Stocker le token chiffré
      expires,
      tokenId,
    },
  });

  return encryptedToken;
};
// Fonction pour vérifier un token signé avec RSA
export const verifyVerificationToken = async (encryptedToken: string) => {
  try {
    // Séparer les différentes parties du token chiffré
    const [ivBase64, authTagBase64, encryptedBase64] =
      encryptedToken.split(".");
    // Convertir en Buffer
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    // Déchiffrer le token avec AES-256-GCM
    // @ts-ignore: Unreachable code error
    const decipher = crypto.createDecipheriv("aes-256-gcm", aesSecretKey, iv);
    // @ts-ignore: Unreachable code error
    decipher.setAuthTag(authTag); // Ajouter le tag d'authentification pour valider l'intégrité

    // Utiliser Buffer pour gérer les données chiffrées
    let decrypted = Buffer.concat([
      // @ts-ignore: Unreachable code error
      decipher.update(encrypted), // Aucun encodage nécessaire ici
      // @ts-ignore: Unreachable code error
      decipher.final(), // Aucun encodage ici non plus
    ]);

    // Convertir le Buffer déchiffré en chaîne de caractères (UTF-8)
    const decryptedToken = decrypted.toString("utf8");

    // Vérifier le JWT déchiffré avec la clé publique RSA
    const decodedToken = verify(decryptedToken, publicKey, {
      algorithms: [ALGORITHM], // Utiliser l'algorithme RS256 pour vérifier la signature
    });

    // Retourner le contenu du token si la vérification a réussi
    return { tokenPayload: decodedToken };
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return { error: "Token expiré" };
    } else {
      console.error("Erreur lors de la vérification du token :", error);
      return { error: "Token invalide" };
    }
  }
};

// Créer un JWT avec chiffrement AES-256-GCM
export const createEncryptedJWT = (payload: object, expiresIn: string) => {
  if (!privateKey) {
    throw new Error("RSA_PRIVATE_KEY n'est pas défini");
  }
  // Créer le JWT signé avec la clé privée RSA
  // @ts-expect-error: expiresIn accepte string à l'exécution (ex: "1h", "1d") mais TypeScript attend un type plus spécifique
  const token = sign(payload, privateKey, {
    algorithm: ALGORITHM,
    expiresIn,
  });

  // Chiffrer le JWT avec AES-256-GCM
  const iv = crypto.randomBytes(12); // Générer un vecteur d'initialisation (IV) de 12 octets pour GCM
  // @ts-ignore: Unreachable code error
  const cipher = crypto.createCipheriv("aes-256-gcm", aesSecretKey, iv);

  let encrypted = cipher.update(token, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64"); // Obtenir le tag d'authentification GCM

  // Retourner le token chiffré avec l'IV et l'authTag
  return `${iv.toString("base64")}.${authTag}.${encrypted}`;
};

// Vérifier et déchiffrer un JWT chiffré
export const verifyEncryptedJWT = (encryptedToken: string) => {
  // Valider que le token est défini et non vide
  if (!encryptedToken || typeof encryptedToken !== "string") {
    throw new Error("Token invalide ou manquant");
  }

  // Séparer les différentes parties du token chiffré (IV, authTag, encryptedToken)
  const parts = encryptedToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Format de token invalide");
  }

  const [ivBase64, authTagBase64, encryptedBase64] = parts;

  // Valider que toutes les parties sont présentes
  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Token incomplet");
  }

  // Convertir en Buffer
  let iv: Buffer;
  let authTag: Buffer;
  let encrypted: Buffer;
  
  try {
    iv = Buffer.from(ivBase64, "base64");
    authTag = Buffer.from(authTagBase64, "base64");
    encrypted = Buffer.from(encryptedBase64, "base64");
  } catch (error) {
    throw new Error("Erreur lors de la conversion du token en Buffer");
  }

  // Déchiffrer le JWT avec AES-256-GCM
  // @ts-ignore: Unreachable code error
  const decipher = crypto.createDecipheriv("aes-256-gcm", aesSecretKey, iv);
  // @ts-ignore: Unreachable code error
  decipher.setAuthTag(authTag); // Ajouter le tag d'authentification pour valider l'intégrité

  // Utilisation de Buffer pour la gestion du déchiffrement
  const decrypted = Buffer.concat([
    // @ts-ignore: Unreachable code error
    decipher.update(encrypted),
    // @ts-ignore: Unreachable code error
    decipher.final(),
  ]);

  // Convertir le Buffer déchiffré en chaîne de caractères (UTF-8)
  const decryptedToken = decrypted.toString("utf8");

  // Vérifier le JWT déchiffré avec la clé publique RSA
  return verify(decryptedToken, publicKey, { algorithms: ["RS256"] });
};

// Fonction pour récupérer l'ID utilisateur à partir du token JWT chiffré
export async function getUserIdFromToken(
  token: string | undefined | null
): Promise<string | null> {
  try {
    // Valider que le token est défini et non vide
    if (!token || typeof token !== "string" || token.trim() === "") {
      return null;
    }

    // Déchiffrer et vérifier le JWT chiffré pour obtenir le payload
    const decodedToken = verifyEncryptedJWT(token);

    // Vérifier que le payload est bien de type JwtPayload et contient l'ID utilisateur
    if (
      typeof decodedToken === "object" &&
      decodedToken !== null &&
      (decodedToken as JwtPayload).userId
    ) {
      const userId = (decodedToken as JwtPayload).userId;
      if (typeof userId === "string" && userId.trim() !== "") {
        return userId;
      }
    }
    // Si le token n'a pas d'ID utilisateur, retourner null
    return null;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return null;
  }
}

export const generateVerificationTokenForModifyEmail = async (
  email: string,
  userId: string
) => {
  const tokenId = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Expiration dans 1 heure

  // Créer le payload pour le JWT
  const payload = {
    email,
    tokenId,
    expires: expires.toISOString(),
    userId,
  };

  // Signer le JWT avec la clé privée RSA (RS256)
  const signedToken = sign(payload, privateKey, {
    algorithm: ALGORITHM,
    expiresIn: "1h", // Expire dans 1 heure
  });

  // Chiffrer le JWT signé avec AES-256-GCM
  const iv = crypto.randomBytes(12); // Générer un vecteur d'initialisation (IV) de 12 octets pour GCM
  // @ts-ignore: Unreachable code error
  const cipher = crypto.createCipheriv("aes-256-gcm", aesSecretKey, iv);

  let encrypted = cipher.update(signedToken, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64"); // Obtenir le tag d'authentification GCM

  // Combiner l'IV, l'authTag et le token chiffré dans un format sécurisé
  const encryptedToken = `${iv.toString("base64")}.${authTag}.${encrypted}`;

  // Supprimer l'ancien token s'il existe
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Stocker le token chiffré dans la base de données
  await db.verificationToken.create({
    data: {
      email,
      token: encryptedToken, // Stocker le token chiffré
      expires,
      tokenId,
      userId,
    },
  });

  return encryptedToken;
};
