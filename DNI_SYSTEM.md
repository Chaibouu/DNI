# Système d'Inscription et de Gestion des Tickets DNI

## Vue d'ensemble

Ce système permet aux participants du Dialogue National Intergénérationnel de :
- S'inscrire en ligne
- Générer un ticket d'entrée unique avec QR Code sécurisé
- Télécharger ou imprimer leurs tickets
- Présenter leur badge/ticket à l'entrée de l'événement (QR code scanning)

## Fonctionnalités

### Pour les participants

1. **Inscription** (`/dni/register`)
   - Formulaire d'inscription avec validation
   - Génération automatique d'un ID unique (format: DNI-2025-XX23AB)
   - Génération automatique d'un QR Code sécurisé
   - Types d'accès disponibles : Général, VIP, Presse, Staff

2. **Visualisation du ticket** (`/dni/ticket/[participantId]`)
   - Affichage du ticket avec QR Code
   - Informations du participant
   - Boutons pour imprimer ou télécharger le ticket

3. **Recherche de ticket** (`/dni/lookup`)
   - Recherche par adresse email
   - Redirection vers la page du ticket

### Pour les administrateurs

1. **Scanner de tickets** (`/admin/dni-scanner`)
   - Interface pour scanner les QR codes
   - Vérification en temps réel
   - Validation et check-in automatique
   - Détection des tickets déjà utilisés

2. **Liste des participants** (`/admin/dni-participants`)
   - Vue d'ensemble de tous les participants
   - Statistiques (total, confirmés, entrés, annulés)
   - Filtres et recherche

## Structure de la base de données

### Modèle DniParticipant

```prisma
model DniParticipant {
  id              String            @id @default(cuid())
  uniqueId        String            @unique // Format: DNI-2025-XX23AB
  firstName       String
  lastName        String
  email           String
  phone           String?
  accessType      AccessType        @default(GENERAL)
  status          ParticipantStatus @default(PENDING)
  qrCode          String?           @unique // QR code en base64
  qrCodeData      String?           // Données encodées dans le QR code
  eventDate       DateTime?
  eventLocation   String?
  checkedInAt     DateTime?
  checkedInBy     String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}
```

### Types d'accès (AccessType)
- `GENERAL` : Accès général
- `VIP` : Accès VIP
- `PRESSE` : Accès presse
- `STAFF` : Accès staff

### Statuts (ParticipantStatus)
- `PENDING` : En attente
- `CONFIRMED` : Confirmé
- `CANCELLED` : Annulé
- `CHECKED_IN` : Entré (check-in effectué)

## Installation et configuration

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push
# ou
npx prisma migrate dev
```

### 3. Variables d'environnement

Assurez-vous d'avoir configuré `DATABASE_URL` dans votre fichier `.env`.

## Utilisation

### Inscription d'un participant

1. Accéder à `/dni/register`
2. Remplir le formulaire :
   - Prénom
   - Nom
   - Email
   - Téléphone (optionnel)
   - Type d'accès
3. Soumettre le formulaire
4. Redirection automatique vers la page du ticket

### Recherche d'un ticket

1. Accéder à `/dni/lookup`
2. Entrer l'adresse email utilisée lors de l'inscription
3. Cliquer sur "Rechercher"
4. Redirection vers la page du ticket

### Scanner un ticket (Admin)

1. Accéder à `/admin/dni-scanner`
2. Démarrer le scan ou saisir manuellement les données du QR code
3. Le système vérifie automatiquement :
   - Validité du ticket
   - Statut (déjà utilisé ou non)
   - Informations du participant
4. Check-in automatique si le ticket est valide

## API Endpoints

### POST `/api/dni/verify`

Vérifie et valide un ticket via son QR code.

**Body:**
```json
{
  "qrCodeData": "{\"id\":\"...\",\"uniqueId\":\"DNI-2025-XX23AB\",\"timestamp\":...}"
}
```

**Réponse (succès):**
```json
{
  "success": true,
  "participant": {
    "id": "...",
    "uniqueId": "DNI-2025-XX23AB",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "accessType": "GENERAL",
    "status": "CHECKED_IN",
    "checkedInAt": "2025-01-15T10:30:00Z"
  },
  "message": "Accès autorisé"
}
```

## Fichiers principaux

- `prisma/schema.prisma` : Modèle de données
- `lib/dni-utils.ts` : Utilitaires (génération ID, QR code)
- `actions/dni-registration.ts` : Actions serveur pour l'inscription
- `app/dni/register/page.tsx` : Page d'inscription
- `app/dni/ticket/[participantId]/page.tsx` : Page de visualisation du ticket
- `app/(dashboard)/admin/dni-scanner/page.tsx` : Page de scan (admin)
- `app/api/dni/verify/route.ts` : API de vérification des tickets

## Notes importantes

1. **Sécurité** : Les QR codes contiennent des données JSON avec l'ID du participant et un timestamp. Pour une sécurité renforcée, vous pourriez ajouter une signature cryptographique.

2. **Scanner QR réel** : La page de scan actuelle utilise une saisie manuelle. Pour un scanner QR réel, intégrez une bibliothèque comme `@zxing/library` ou `react-qr-reader`.

3. **Génération d'ID unique** : L'ID unique est généré avec le format `DNI-YYYY-XXXXXX` où YYYY est l'année et XXXXXX est une chaîne aléatoire hexadécimale.

4. **QR Code** : Les QR codes sont générés en base64 et stockés dans la base de données. Ils peuvent être affichés directement dans le navigateur.

## Améliorations possibles

- [ ] Intégration d'un scanner QR réel avec caméra
- [ ] Export CSV/Excel de la liste des participants
- [ ] Envoi d'email de confirmation avec le ticket en pièce jointe
- [ ] Signature cryptographique des QR codes
- [ ] Statistiques avancées et graphiques
- [ ] Filtres et recherche dans la liste des participants
- [ ] Génération de rapports

