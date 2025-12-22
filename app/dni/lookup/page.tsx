"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/form-error";
import { getDniParticipantByEmail } from "@/actions/dni-registration";
import { Search } from "lucide-react";

export default function DniLookupPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Pré-remplir l'email depuis l'URL si présent
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Veuillez entrer une adresse email");
      return;
    }

    startTransition(() => {
      getDniParticipantByEmail(email).then((result) => {
        if (result.error || !result.data) {
          setError(result.error || "Aucun ticket trouvé pour cet email");
        } else {
          // Rediriger vers la page du ticket
          router.push(`/dni/ticket/${result.data.id}`);
        }
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Rechercher mon ticket</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Entrez votre adresse email pour retrouver votre ticket d'entrée
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="votre.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="w-full"
            />
          </div>
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending || !email.trim()}
            className="w-full"
            size="lg"
          >
            <Search className="mr-2 h-4 w-4" />
            {isPending ? "Recherche en cours..." : "Rechercher mon ticket"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/dni"
            className="text-sm hover:underline"
            style={{ color: "#0D7702" }}
          >
            Pas encore inscrit ? Retour à l'inscription
          </a>
        </div>
      </Card>
    </div>
  );
}

