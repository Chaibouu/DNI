import { NextRequest, NextResponse } from "next/server";
import { getDniParticipantById } from "@/actions/dni-registration";
import puppeteer from "puppeteer";

// Forcer le rendu dynamique
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ participantId: string }> }
) {
  let browser;
  try {
    const { participantId } = await params;
    const result = await getDniParticipantById(participantId);

    if (result.error || !result.data) {
      return NextResponse.json(
        { error: "Participant non trouvé" },
        { status: 404 }
      );
    }

    const participant = result.data;

    // Lancer Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    
    // Définir la taille de la page pour correspondre au ticket (600x300px)
    await page.setViewport({
      width: 600,
      height: 300,
      deviceScaleFactor: 2, // Haute résolution
    });

    // Construire l'URL de la page de rendu avec le composant React
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const renderUrl = `${baseUrl}/dni/ticket-render/${participantId}`;

    // Naviguer vers la page de rendu
    await page.goto(renderUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Attendre que le ticket soit complètement rendu
    try {
      await page.waitForSelector('[data-ticket-container]', { 
        timeout: 15000,
        visible: true 
      });
    } catch (error) {
      console.error("Sélecteur [data-ticket-container] non trouvé:", error);
      await browser.close();
      return NextResponse.json(
        { error: "Élément du ticket non trouvé sur la page de rendu" },
        { status: 500 }
      );
    }

    // Attendre que React soit complètement hydraté et rendu
    await page.waitForFunction(
      () => {
        const container = document.querySelector('[data-ticket-container]');
        if (!container) return false;
        // Vérifier que le contenu est rendu (pas juste le conteneur vide)
        const hasContent = container.children.length > 0;
        const hasText = container.textContent && container.textContent.trim().length > 0;
        return hasContent && hasText;
      },
      { timeout: 10000 }
    ).catch(() => {
      console.warn("La fonction d'attente du contenu a expiré, continuation...");
    });

    // Attendre que toutes les images soient chargées
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = resolve; // Continuer même en cas d'erreur
            setTimeout(resolve, 3000); // Timeout après 3 secondes
          });
        })
      );
    }).catch(() => {
      // Continuer même si certaines images ne se chargent pas
    });

    // Attendre un peu plus pour que le rendu soit stable
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Générer le PDF avec les dimensions exactes du ticket (600x300px)
    const pdf = await page.pdf({
      width: "600px",
      height: "300px",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    await browser.close();

    // Retourner le PDF
    return new Response(pdf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ticket-dni-${participant.uniqueId}.pdf"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de la génération du PDF du ticket:", error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { error: `Erreur lors de la génération du PDF: ${error.message}` },
      { status: 500 }
    );
  }
}

