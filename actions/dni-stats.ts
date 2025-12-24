"use server";

import { db } from "@/lib/db";

export interface DniStats {
  total: number;
  byStatus: {
    PENDING: number;
    CONFIRMED: number;
    CANCELLED: number;
    CHECKED_IN: number;
  };
  byCategory: {
    ELEVE: number;
    ETUDIANT: number;
    STAGIAIRE: number;
    APPRENTI: number;
    JEUNE_PROFESSIONNEL: number;
    PROFESSIONNEL: number;
    FONCTIONNAIRE: number;
    ENTREPRENEUR: number;
    INDEPENDANT: number;
    SANS_EMPLOI: number;
    CHOMAGE: number;
    RETRAITE: number;
    ACTEUR_SOCIETE_CIVILE: number;
    LEADER_COMMUNAUTAIRE: number;
    LEADER_TRADITIONNEL: number;
    ONG: number;
    ASSOCIATION: number;
    ORGANISATION: number;
    INSTITUTION: number;
    MEDIA: number;
    JOURNALISTE: number;
    DIASPORA: number;
    AUTRE: number;
  };
  byGender: {
    MASCULIN: number;
    FEMININ: number;
    AUTRE: number;
    NULL: number;
  };
  withEmail: number;
  withPhone: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export async function getDniStats(): Promise<DniStats> {
  try {
    // Total de participants
    const total = await db.dniParticipant.count();

    // Par statut
    const byStatus = {
      PENDING: await db.dniParticipant.count({ where: { status: "PENDING" } }),
      CONFIRMED: await db.dniParticipant.count({ where: { status: "CONFIRMED" } }),
      CANCELLED: await db.dniParticipant.count({ where: { status: "CANCELLED" } }),
      CHECKED_IN: await db.dniParticipant.count({ where: { status: "CHECKED_IN" } }),
    };

    // Par catégorie
    const byCategory = {
      ELEVE: await db.dniParticipant.count({ where: { category: "ELEVE" } }),
      ETUDIANT: await db.dniParticipant.count({ where: { category: "ETUDIANT" } }),
      STAGIAIRE: await db.dniParticipant.count({ where: { category: "STAGIAIRE" } }),
      APPRENTI: await db.dniParticipant.count({ where: { category: "APPRENTI" } }),
      JEUNE_PROFESSIONNEL: await db.dniParticipant.count({ where: { category: "JEUNE_PROFESSIONNEL" } }),
      PROFESSIONNEL: await db.dniParticipant.count({ where: { category: "PROFESSIONNEL" } }),
      FONCTIONNAIRE: await db.dniParticipant.count({ where: { category: "FONCTIONNAIRE" } }),
      ENTREPRENEUR: await db.dniParticipant.count({ where: { category: "ENTREPRENEUR" } }),
      INDEPENDANT: await db.dniParticipant.count({ where: { category: "INDEPENDANT" } }),
      SANS_EMPLOI: await db.dniParticipant.count({ where: { category: "SANS_EMPLOI" } }),
      CHOMAGE: await db.dniParticipant.count({ where: { category: "CHOMAGE" } }),
      RETRAITE: await db.dniParticipant.count({ where: { category: "RETRAITE" } }),
      ACTEUR_SOCIETE_CIVILE: await db.dniParticipant.count({ where: { category: "ACTEUR_SOCIETE_CIVILE" } }),
      LEADER_COMMUNAUTAIRE: await db.dniParticipant.count({ where: { category: "LEADER_COMMUNAUTAIRE" } }),
      LEADER_TRADITIONNEL: await db.dniParticipant.count({ where: { category: "LEADER_TRADITIONNEL" } }),
      ONG: await db.dniParticipant.count({ where: { category: "ONG" } }),
      ASSOCIATION: await db.dniParticipant.count({ where: { category: "ASSOCIATION" } }),
      ORGANISATION: await db.dniParticipant.count({ where: { category: "ORGANISATION" } }),
      INSTITUTION: await db.dniParticipant.count({ where: { category: "INSTITUTION" } }),
      MEDIA: await db.dniParticipant.count({ where: { category: "MEDIA" } }),
      JOURNALISTE: await db.dniParticipant.count({ where: { category: "JOURNALISTE" } }),
      DIASPORA: await db.dniParticipant.count({ where: { category: "DIASPORA" } }),
      AUTRE: await db.dniParticipant.count({ where: { category: "AUTRE" } }),
    };

    // Par sexe
    const byGender = {
      MASCULIN: await db.dniParticipant.count({ where: { gender: "MASCULIN" } }),
      FEMININ: await db.dniParticipant.count({ where: { gender: "FEMININ" } }),
      AUTRE: await db.dniParticipant.count({ where: { gender: "AUTRE" } }),
      NULL: await db.dniParticipant.count({ where: { gender: null } }),
    };

    // Avec email
    const withEmail = await db.dniParticipant.count({
      where: {
        email: { not: null },
      },
    });

    // Avec téléphone (tous ont un téléphone maintenant car c'est obligatoire)
    const withPhone = total;

    // Aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await db.dniParticipant.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Cette semaine
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    thisWeek.setHours(0, 0, 0, 0);
    const thisWeekCount = await db.dniParticipant.count({
      where: {
        createdAt: {
          gte: thisWeek,
        },
      },
    });

    // Ce mois
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const thisMonthCount = await db.dniParticipant.count({
      where: {
        createdAt: {
          gte: thisMonth,
        },
      },
    });

    return {
      total,
      byStatus,
      byCategory,
      byGender,
      withEmail,
      withPhone,
      today: todayCount,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques DNI:", error);
    throw error;
  }
}

