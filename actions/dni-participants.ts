"use server";

import { db } from "@/lib/db";

/**
 * Action pour récupérer les participants DNI avec pagination
 */
export async function getAllDniParticipants(page: number = 1, limit: number = 50) {
  try {
    const skip = (page - 1) * limit;

    const [participants, total] = await Promise.all([
      db.dniParticipant.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.dniParticipant.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      participants,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des participants:", error);
    return {
      participants: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      error: "Erreur lors de la récupération des participants",
    };
  }
}

