import { getDniParticipantById } from "@/actions/dni-registration";
import { DniTicketAlternativeView } from "@/components/dni/DniTicketAlternativeView";
import { notFound } from "next/navigation";

interface DniTicketPageProps {
  params: Promise<{
    participantId: string;
  }>;
}

export default async function DniTicketPage({ params }: DniTicketPageProps) {
  const { participantId } = await params;
  const result = await getDniParticipantById(participantId);

  if (result.error || !result.data) {
    notFound();
  }

  const participant = result.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <DniTicketAlternativeView participant={participant} />
    </div>
  );
}

