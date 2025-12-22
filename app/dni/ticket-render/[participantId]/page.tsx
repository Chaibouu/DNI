import { getDniParticipantById } from "@/actions/dni-registration";
import { DniTicketAlternative } from "@/components/dni/DniTicketAlternative";
import { notFound } from "next/navigation";

interface DniTicketRenderPageProps {
  params: Promise<{
    participantId: string;
  }>;
}

export default async function DniTicketRenderPage({ params }: DniTicketRenderPageProps) {
  const { participantId } = await params;
  const result = await getDniParticipantById(participantId);

  if (result.error || !result.data) {
    notFound();
  }

  const participant = result.data;

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "600px",
        height: "300px",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <DniTicketAlternative participant={participant} />
    </div>
  );
}

