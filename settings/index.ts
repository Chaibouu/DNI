const appConfig = {
  appName: "Dialogue National Intergénérationnel",
  websiteTitle: "La Grande Rencontre - DNI - Dialogue National Intergénérationnel",
  websiteDescription:
    "La plateforme de gestion des participants du Dialogue National Intergénérationnel",
  logoUrl: "/logo.png",
  sidebarClearlogoUrl: "/logo.png",
  adminSidebarColor: "#1C2434",
  mailOptions: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASSWORD,
    },
  },
  publicRoutes: ["/","/dni","/affiche"],
  defaultLoginRedirect: "/test",
  primaryColor: "#0D7702",
  secondaryColor: "#F13D06",

  // Ajout d'une option pour autoriser ou non les connexions multiples
  allowMultipleSessions: false, // ou false pour invalider les anciennes sessions
  rateLimit: {
    windowMs: 10 * 1000, // Durée de la fenêtre en ms (10 seconds)
    max: 5, // Nombre maximum de requêtes par IP dans la fenêtre
  },
  // Configuration du Backoff progressif
  backoff: {
    maxAttempts: 5, // Nombre maximal de tentatives de connexion avant blocage
    backoffDelayFactor: 2, // Facteur de progression du backoff (multiplicateur)
  },
};

export default appConfig;
