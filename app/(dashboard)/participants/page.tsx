import { getAllDniParticipants } from "@/actions/dni-participants";
import { DniParticipantsList } from "@/components/dni/DniParticipantsList";
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ParticipantsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ParticipantsPage({ searchParams }: ParticipantsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const { participants, pagination } = await getAllDniParticipants(page, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2" style={{ color: "#0D7702" }}>
          <Users className="h-8 w-8" />
          Participants
        </h1>
        <p className="text-muted-foreground">
          Liste de tous les participants inscrits au Dialogue National Intergénérationnel
          {pagination && pagination.total > 0 && (
            <span className="ml-2">
              ({pagination.total} participant{pagination.total > 1 ? "s" : ""})
            </span>
          )}
        </p>
      </div>

      <DniParticipantsList participants={participants} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Link
            href={`/participants?page=${pagination.page - 1}`}
            className={!pagination.hasPrev ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              style={{ borderColor: "#0D7702", color: "#0D7702" }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page <strong>{pagination.page}</strong> sur <strong>{pagination.totalPages}</strong>
            </span>
            <span className="text-xs text-gray-500">
              ({pagination.total} participant{pagination.total > 1 ? "s" : ""})
            </span>
          </div>

          <Link
            href={`/participants?page=${pagination.page + 1}`}
            className={!pagination.hasNext ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              style={{ borderColor: "#0D7702", color: "#0D7702" }}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

