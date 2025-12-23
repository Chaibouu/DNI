"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, QrCode, Ticket, CheckCircle2 } from "lucide-react";
import { DniRegistrationForm } from "@/components/dni/DniRegistrationForm";
import { useState } from "react";

export default function DniHomePage() {
  const [showLookup, setShowLookup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* En-tête avec message d'introduction */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Logo DNI"
              width={120}
              height={120}
              className="rounded-lg"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Dialogue National Intergénérationnel
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
           Réservez dès maintenant pour participer à cet événement exceptionnel
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <CheckCircle2 className="h-5 w-5" style={{ color: "#0D7702" }} />
            <p className="text-lg">
              Obtenez votre ticket d'entrée unique avec QR code en quelques minutes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Formulaire de réservation - Colonne principale */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8 shadow-xl">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: "rgba(13, 119, 2, 0.1)" }}>
                    <Ticket className="h-6 w-6" style={{ color: "#0D7702" }} />
                  </div>
                  <h2 className="text-2xl font-bold">Réservation</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Remplissez le formulaire ci-dessous pour recevoir votre ticket d'entrée
                </p>
              </div>
              <DniRegistrationForm />
            </Card>
          </div>

          {/* Colonne latérale - Recherche de ticket */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: "rgba(241, 61, 6, 0.1)" }}>
                  <Search className="h-6 w-6" style={{ color: "#F13D06" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Déjà inscrit ?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Retrouvez votre ticket en saisissant votre email
                </p>
              </div>
              {!showLookup ? (
                <Button
                  onClick={() => setShowLookup(true)}
                  variant="outline"
                  className="w-full"
                >
                  Rechercher mon ticket
                </Button>
              ) : (
                <div className="space-y-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const email = (e.currentTarget.email as HTMLInputElement).value;
                      if (email) {
                        window.location.href = `/dni/lookup?email=${encodeURIComponent(email)}`;
                      }
                    }}
                    className="space-y-3"
                  >
                    <input
                      name="email"
                      type="email"
                      placeholder="votre.email@example.com"
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                    <Button type="submit" className="w-full" size="sm">
                      Rechercher
                    </Button>
                  </form>
                  <Button
                    onClick={() => setShowLookup(false)}
                    variant="ghost"
                    className="w-full text-sm"
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </Card>

            {/* Instructions rapides */}
            <Card className="p-6 border" style={{ backgroundColor: "rgba(13, 119, 2, 0.05)", borderColor: "rgba(13, 119, 2, 0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <QrCode className="h-5 w-5" style={{ color: "#0D7702" }} />
                <h3 className="font-semibold" style={{ color: "#0D7702" }}>
                  Comment ça fonctionne ?
                </h3>
              </div>
              <ol className="space-y-2 text-sm" style={{ color: "#0A5D01" }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Remplissez le formulaire de réservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Recevez votre ticket unique avec QR code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Téléchargez ou imprimez votre ticket</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span>Présentez-le à l'entrée de l'événement</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>

        {/* Section informative supplémentaire */}
        <Card className="p-6 border" style={{ background: "linear-gradient(to right, rgba(13, 119, 2, 0.05), rgba(13, 119, 2, 0.08))", borderColor: "rgba(13, 119, 2, 0.2)" }}>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Pourquoi s'inscrire maintenant ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold mb-1">✓ Accès garanti</p>
                <p>Votre place est réservée dès la réservation</p>
              </div>
              <div>
                <p className="font-semibold mb-1">✓ Ticket numérique</p>
                <p>Recevez votre ticket instantanément par email</p>
              </div>
              <div>
                <p className="font-semibold mb-1">✓ Entrée rapide</p>
                <p>Présentez votre QR code pour un accès fluide</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

