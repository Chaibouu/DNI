"use client";

import { DniParticipant } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import Link from "next/link";

interface DniParticipantsListProps {
  participants: DniParticipant[];
}

const categoryLabels: Record<string, string> = {
  ELEVE: "Élève",
  ETUDIANT: "Étudiant",
  STAGIAIRE: "Stagiaire",
  APPRENTI: "Apprenti",
  JEUNE_PROFESSIONNEL: "Jeune professionnel",
  PROFESSIONNEL: "Professionnel",
  FONCTIONNAIRE: "Fonctionnaire",
  ENTREPRENEUR: "Entrepreneur",
  INDEPENDANT: "Travailleur indépendant",
  SANS_EMPLOI: "Sans emploi",
  CHOMAGE: "Chômage",
  RETRAITE: "Retraité",
  ACTEUR_SOCIETE_CIVILE: "Acteur de la société civile",
  LEADER_COMMUNAUTAIRE: "Leader communautaire",
  LEADER_TRADITIONNEL: "Leader traditionnel",
  ONG: "ONG",
  ASSOCIATION: "Association",
  ORGANISATION: "Organisation",
  INSTITUTION: "Institution",
  MEDIA: "Média",
  JOURNALISTE: "Journaliste",
  DIASPORA: "Diaspora",
  AUTRE: "Autre (à préciser)",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  CHECKED_IN: "Entré",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "rgba(255, 193, 7, 0.1)", text: "#856404" },
  CONFIRMED: { bg: "rgba(13, 119, 2, 0.1)", text: "#0D7702" },
  CANCELLED: { bg: "rgba(241, 61, 6, 0.1)", text: "#F13D06" },
  CHECKED_IN: { bg: "rgba(13, 119, 2, 0.15)", text: "#0A5D01" },
};

export function DniParticipantsList({ participants }: DniParticipantsListProps) {
  if (participants.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">Aucun participant inscrit pour le moment</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">ID Unique</th>
              <th className="text-left p-3 font-semibold">Nom complet</th>
              <th className="text-left p-3 font-semibold">Email</th>
              <th className="text-left p-3 font-semibold">Statut</th>
              <th className="text-left p-3 font-semibold">Statut</th>
              <th className="text-left p-3 font-semibold">Date de réservation</th>
              <th className="text-left p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">
                  <code className="text-sm font-mono">{participant.uniqueId}</code>
                </td>
                <td className="p-3">
                  {participant.firstName} {participant.lastName}
                </td>
                <td className="p-3">{participant.email}</td>
                <td className="p-3">
                  <Badge variant="outline">
                    {categoryLabels[participant.category] || participant.category}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge 
                    style={{ 
                      backgroundColor: statusColors[participant.status]?.bg || "rgba(0, 0, 0, 0.1)",
                      color: statusColors[participant.status]?.text || "#000"
                    }}
                  >
                    {statusLabels[participant.status] || participant.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(participant.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-3">
                  <Link href={`/dni/ticket/${participant.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

