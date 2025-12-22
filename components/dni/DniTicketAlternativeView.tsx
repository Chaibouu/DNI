"use client";

import { Button } from "@/components/ui/button";
import { DniParticipant } from "@prisma/client";
import { Printer, FileImage, FileText } from "lucide-react";
import { useState, useRef } from "react";
import { DniTicketAlternative } from "./DniTicketAlternative";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface DniTicketAlternativeViewProps {
  participant: DniParticipant;
}

export function DniTicketAlternativeView({ participant }: DniTicketAlternativeViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Fonction pour attendre que toutes les images soient chargées
  const waitForImages = (element: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const images = Array.from(element.querySelectorAll("img"));
      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          // Attendre encore un peu pour que le rendu soit stable
          setTimeout(() => resolve(), 200);
        }
      };

      images.forEach((img) => {
        // Forcer le rechargement si nécessaire
        if (img.src && !img.complete) {
          const originalSrc = img.src;
          img.src = "";
          img.src = originalSrc;
        }

        if (img.complete && img.naturalHeight !== 0) {
          checkComplete();
        } else {
          img.onload = () => {
            checkComplete();
          };
          img.onerror = () => {
            console.warn("Erreur de chargement d'image:", img.src);
            checkComplete(); // Continuer même si une image échoue
          };
          // Timeout après 5 secondes
          setTimeout(() => {
            checkComplete();
          }, 5000);
        }
      });
    });
  };

  const handleDownloadImage = async () => {
    try {
      setIsProcessing(true);
      
      if (!ticketRef.current) {
        throw new Error("Élément du ticket non trouvé");
      }

      // Attendre que toutes les images soient chargées
      await waitForImages(ticketRef.current);
      
      // Attendre un peu plus pour être sûr
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Obtenir les dimensions réelles du ticket
      const width = ticketRef.current.offsetWidth;
      const height = ticketRef.current.offsetHeight;
      const padding = 60; // Padding des deux côtés pour centrer et éviter la coupure

      // Créer un conteneur parent avec padding
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: ${width + padding * 2}px;
        height: ${height}px;
        padding: 0 ${padding}px;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        z-index: 9999;
      `;
      
      // Déplacer temporairement le ticket dans le wrapper
      const parent = ticketRef.current.parentElement;
      const nextSibling = ticketRef.current.nextSibling;
      
      wrapper.appendChild(ticketRef.current);
      document.body.appendChild(wrapper);

      // Attendre que le rendu soit stable
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Générer l'image avec html-to-image
      const dataUrl = await toPng(wrapper, {
        quality: 1,
        pixelRatio: 2, // Meilleure qualité
        backgroundColor: "#ffffff",
        cacheBust: true,
        width: width + padding * 2,
        height: height,
        filter: (node) => {
          // Inclure toutes les images
          return true;
        },
      });

      // Remettre le ticket à sa place originale
      if (nextSibling && parent) {
        parent.insertBefore(ticketRef.current, nextSibling);
      } else if (parent) {
        parent.appendChild(ticketRef.current);
      }
      
      // Nettoyer le conteneur temporaire
      document.body.removeChild(wrapper);

      // Créer un lien de téléchargement
      const link = document.createElement("a");
      link.download = `ticket-dni-${participant.uniqueId}.png`;
      link.href = dataUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error: any) {
      console.error("Erreur lors du téléchargement de l'image:", error);
      alert(`Erreur lors de la génération de l'image du ticket: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsProcessing(true);
      
      if (!ticketRef.current) {
        throw new Error("Élément du ticket non trouvé");
      }

      // Attendre que toutes les images soient chargées
      await waitForImages(ticketRef.current);
      
      // Attendre un peu plus pour être sûr
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Obtenir les dimensions réelles du ticket
      const width = ticketRef.current.offsetWidth;
      const height = ticketRef.current.offsetHeight;
      const padding = 60; // Padding des deux côtés pour centrer et éviter la coupure

      // Créer un conteneur parent avec padding
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: ${width + padding * 2}px;
        height: ${height}px;
        padding: 0 ${padding}px;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        z-index: 9999;
      `;
      
      // Déplacer temporairement le ticket dans le wrapper
      const parent = ticketRef.current.parentElement;
      const nextSibling = ticketRef.current.nextSibling;
      
      wrapper.appendChild(ticketRef.current);
      document.body.appendChild(wrapper);

      // Attendre que le rendu soit stable
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Générer l'image avec html-to-image
      const dataUrl = await toPng(wrapper, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        width: width + padding * 2,
        height: height,
        filter: (node) => {
          // Inclure toutes les images
          return true;
        },
      });

      // Remettre le ticket à sa place originale
      if (nextSibling && parent) {
        parent.insertBefore(ticketRef.current, nextSibling);
      } else if (parent) {
        parent.appendChild(ticketRef.current);
      }
      
      // Nettoyer le conteneur temporaire
      document.body.removeChild(wrapper);

      // Créer le PDF avec jsPDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [width + padding * 2, height], // Dimensions avec padding
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, width + padding * 2, height);
      pdf.save(`ticket-dni-${participant.uniqueId}.pdf`);
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du PDF:", error);
      alert(`Erreur lors de la génération du PDF du ticket: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsProcessing(true);
      
      // Ouvrir directement la page de rendu avec le composant React dans une nouvelle fenêtre pour l'impression
      const baseUrl = window.location.origin;
      const printUrl = `${baseUrl}/dni/ticket-render/${participant.id}`;
      
      const printWindow = window.open(printUrl, "_blank");
      if (!printWindow) {
        throw new Error("Impossible d'ouvrir la fenêtre d'impression");
      }

      // Attendre que la page soit chargée
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
      // Fallback si onload ne se déclenche pas
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.print();
        }
      }, 1000);
    } catch (error: any) {
      console.error("Erreur lors de l'impression:", error);
      alert(`Erreur lors de l'impression: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="mb-4 sm:mb-6 text-center no-print">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: "#0D7702" }}>
          Votre Ticket d'Entrée
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Téléchargez votre ticket en PDF ou en image
        </p>
      </div>

      <div 
        className="relative mx-auto flex justify-center items-center w-full"
        style={{ 
          backgroundColor: "transparent",
          overflow: "visible",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-full" style={{ margin: 0, padding: 0 }}>
          <DniTicketAlternative ref={ticketRef} participant={participant} />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center no-print">
        <Button 
          onClick={handleDownloadPDF} 
          variant="outline" 
          size="default"
          className="w-full sm:w-auto"
          style={{ borderColor: "#0D7702", color: "#0D7702" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f0fdf4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          disabled={isProcessing}
        >
          <FileText className="mr-2 h-4 w-4" />
          {isProcessing ? "Traitement..." : "Télécharger PDF"}
        </Button>
        <Button 
          onClick={handleDownloadImage} 
          variant="outline" 
          size="default"
          className="w-full sm:w-auto"
          style={{ borderColor: "#0D7702", color: "#0D7702" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f0fdf4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          disabled={isProcessing}
        >
          <FileImage className="mr-2 h-4 w-4" />
          {isProcessing ? "Traitement..." : "Télécharger Image"}
        </Button>
        <Button 
          onClick={handlePrint} 
          variant="outline" 
          size="default"
          className="w-full sm:w-auto"
          style={{ borderColor: "#0D7702", color: "#0D7702" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f0fdf4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          disabled={isProcessing}
        >
          <Printer className="mr-2 h-4 w-4" />
          {isProcessing ? "Traitement..." : "Imprimer"}
        </Button>
      </div>
    </div>
  );
}

