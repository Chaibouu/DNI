"use client";

import { useState, useRef, useEffect } from "react";

export default function AffichePage() {
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
  const [photoAdjustment, setPhotoAdjustment] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  const [isBadgeLoaded, setIsBadgeLoaded] = useState(false);
  const [showAdjustSection, setShowAdjustSection] = useState(false);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const adjustPreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  const userImageInputRef = useRef<HTMLInputElement>(null);
  const adjustStartXRef = useRef(0);
  const adjustStartYRef = useRef(0);
  const posterImageRef = useRef<HTMLImageElement | null>(null);
  const badgeImageRef = useRef<HTMLImageElement | null>(null);

  // Charger les images de l'affiche et du badge
  useEffect(() => {
    const posterImg = new Image();
    posterImg.crossOrigin = "anonymous";
    posterImg.onload = () => {
      posterImageRef.current = posterImg;
      setIsPosterLoaded(true);
      if (canvasRef.current) {
        canvasRef.current.width = posterImg.width;
        canvasRef.current.height = posterImg.height;
      }
    };
    posterImg.onerror = () => {
      alert("Erreur lors du chargement de l'affiche. Assurez-vous que le fichier affiche.png existe.");
    };
    posterImg.src = "/affiche.png";

    const badgeImg = new Image();
    badgeImg.crossOrigin = "anonymous";
    badgeImg.onload = () => {
      badgeImageRef.current = badgeImg;
      setIsBadgeLoaded(true);
    };
    badgeImg.onerror = () => {
      console.warn("Le badge n'a pas pu être chargé. L'affiche sera générée sans badge.");
      setIsBadgeLoaded(true);
    };
    badgeImg.src = "/badge.png";
  }, []);

  // Fonction pour vérifier que la police Arizonia est chargée
  const ensureFontLoaded = async () => {
    if ("fonts" in document) {
      try {
        await document.fonts.load('1em "Arizonia"');
        await document.fonts.ready;
      } catch (e) {
        console.warn("Erreur lors du chargement de la police Arizonia:", e);
      }
    }
  };

  // Gérer l'upload de l'image utilisateur
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setUserImage(img);
          setPreviewImageSrc(event.target?.result as string);
          setPhotoAdjustment({ offsetX: 0, offsetY: 0, scale: 1 });
          updateAdjustPreview(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour mettre à jour l'aperçu d'ajustement
  const updateAdjustPreview = (img?: HTMLImageElement) => {
    const imageToUse = img || userImage;
    if (!imageToUse || !adjustPreviewCanvasRef.current) return;

    const size = 300;
    const canvas = adjustPreviewCanvasRef.current;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    const aspectRatio = imageToUse.width / imageToUse.height;
    let drawWidth, drawHeight;

    if (aspectRatio > 1) {
      drawHeight = radius * 2 * 1.1 * photoAdjustment.scale;
      drawWidth = drawHeight * aspectRatio;
    } else {
      drawWidth = radius * 2 * 1.1 * photoAdjustment.scale;
      drawHeight = drawWidth / aspectRatio;
    }

    const x = centerX - drawWidth / 2 + photoAdjustment.offsetX;
    const y = centerY - drawHeight / 2 + photoAdjustment.offsetY;

    ctx.drawImage(imageToUse, x, y, drawWidth, drawHeight);
    ctx.restore();
  };

  // Mettre à jour l'aperçu quand les ajustements changent
  useEffect(() => {
    if (userImage) {
      updateAdjustPreview();
    }
  }, [photoAdjustment, userImage]);

  // Générer l'affiche
  const generatePoster = async () => {
    if (!posterImageRef.current || !userImage || !canvasRef.current) {
      alert("Veuillez d'abord charger votre photo.");
      return;
    }

    setLoading(true);
    await ensureFontLoaded();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const posterImage = posterImageRef.current;
    ctx.drawImage(posterImage, 0, 0);

    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.59;
    const radius = canvas.width * 0.21;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    const aspectRatio = userImage.width / userImage.height;
    let drawWidth, drawHeight;

    if (aspectRatio > 1) {
      drawHeight = radius * 2 * 1.1;
      drawWidth = drawHeight * aspectRatio;
    } else {
      drawWidth = radius * 2 * 1.1;
      drawHeight = drawWidth / aspectRatio;
    }

    const adjustedWidth = drawWidth * photoAdjustment.scale;
    const adjustedHeight = drawHeight * photoAdjustment.scale;

    const previewRadius = 150;
    const scaleRatio = radius / previewRadius;
    const scaledOffsetX = photoAdjustment.offsetX * scaleRatio;
    const scaledOffsetY = photoAdjustment.offsetY * scaleRatio;

    const x = centerX - adjustedWidth / 2 + scaledOffsetX;
    const y = centerY - adjustedHeight / 2 + scaledOffsetY;

    ctx.drawImage(userImage, x, y, adjustedWidth, adjustedHeight);
    ctx.restore();

    // Dessiner le badge
    if (badgeImageRef.current && isBadgeLoaded) {
      const badgeSize = radius * 0.6;
      const badgeX = centerX + radius * 0.43;
      const badgeY = centerY - radius * 1.02;
      const badgeCenterX = badgeX + badgeSize / 2;
      const badgeCenterY = badgeY + badgeSize / 2;
      const badgeRadius = badgeSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(badgeCenterX, badgeCenterY, badgeRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(badgeImageRef.current, badgeX, badgeY, badgeSize, badgeSize);
      ctx.restore();
    }

    // Dessiner le texte "J'y serai"
    ctx.save();
    ctx.font = (canvas.width * 0.1) + 'px "Arizonia", cursive';
    ctx.fillStyle = "#F13D06";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const textY = centerY + radius + (canvas.height * 0.05);
    ctx.fillText("J'y serai", centerX, textY);
    ctx.restore();

    setLoading(false);
  };

  // Télécharger l'affiche
  const downloadPoster = () => {
    if (!canvasRef.current || !canvasRef.current.width || !canvasRef.current.height) {
      alert("Veuillez d'abord générer l'affiche.");
      return;
    }

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "affiche-personnalisee-jy-serai.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.95);
  };

  // Gérer le zoom
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setPhotoAdjustment((prev) => ({ ...prev, scale }));
  };

  // Déplacer la photo
  const movePhoto = (deltaX: number, deltaY: number) => {
    setPhotoAdjustment((prev) => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY,
    }));
  };

  // Gérer le déplacement avec la souris
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!userImage) return;
    setIsAdjusting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    adjustStartXRef.current = e.clientX - rect.left - photoAdjustment.offsetX;
    adjustStartYRef.current = e.clientY - rect.top - photoAdjustment.offsetY;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isAdjusting || !adjustPreviewCanvasRef.current) return;
      const rect = adjustPreviewCanvasRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;
      setPhotoAdjustment((prev) => ({
        ...prev,
        offsetX: e.clientX - rect.left - adjustStartXRef.current,
        offsetY: e.clientY - rect.top - adjustStartYRef.current,
      }));
    };

    const handleMouseUp = () => {
      setIsAdjusting(false);
    };

    if (isAdjusting) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isAdjusting]);

  // Gérer le zoom avec la molette
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setPhotoAdjustment((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale + delta)),
    }));
  };

  // Gérer le touch pour mobile
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const lastTouchDistanceRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsAdjusting(true);
      const rect = e.currentTarget.getBoundingClientRect();
      touchStartXRef.current = e.touches[0].clientX - rect.left - photoAdjustment.offsetX;
      touchStartYRef.current = e.touches[0].clientY - rect.top - photoAdjustment.offsetY;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.touches.length === 1 && isAdjusting) {
      const rect = e.currentTarget.getBoundingClientRect();
      setPhotoAdjustment((prev) => ({
        ...prev,
        offsetX: e.touches[0].clientX - rect.left - touchStartXRef.current,
        offsetY: e.touches[0].clientY - rect.top - touchStartYRef.current,
      }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDistanceRef.current > 0) {
        const scaleChange = (distance - lastTouchDistanceRef.current) / 100;
        setPhotoAdjustment((prev) => ({
          ...prev,
          scale: Math.max(0.5, Math.min(2, prev.scale + scaleChange)),
        }));
      }
      lastTouchDistanceRef.current = distance;
    }
  };

  const handleTouchEnd = () => {
    setIsAdjusting(false);
    lastTouchDistanceRef.current = 0;
  };

  // Réinitialiser les ajustements
  const resetAdjustment = () => {
    setPhotoAdjustment({ offsetX: 0, offsetY: 0, scale: 1 });
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#0D7702", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", background: "white", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)", padding: "30px" }}>
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "10px", fontSize: "2em" }}>
          Dialogue National Intergénérationnel
        </h1>
        <div style={{ display: "inline-block", background: "#F13D06", color: "white", padding: "8px 20px", borderRadius: "25px", fontWeight: "bold", marginBottom: "30px", textAlign: "center", width: "100%" }}>
          Campagne "J'y serai" - La Grande Rencontre - DNI - Dialogue National Intergénérationnel 2025
        </div>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px", fontSize: "1.1em" }}>
          Créez votre affiche personnalisée en quelques clics !
        </p>

        <div style={{ background: "#e8f5e9", padding: "20px", borderRadius: "10px", marginBottom: "30px", borderLeft: "4px solid #0D7702" }}>
          <h3 style={{ color: "#0D7702", marginBottom: "10px" }}>📋 Instructions :</h3>
          <ol style={{ marginLeft: "20px", color: "#555" }}>
            <li style={{ marginBottom: "8px" }}>Téléchargez votre photo (format JPG, PNG recommandé)</li>
            <li style={{ marginBottom: "8px" }}>Cliquez sur "Générer l'affiche" pour créer votre affiche personnalisée</li>
            <li style={{ marginBottom: "8px" }}>Ajustez si nécessaire et téléchargez votre affiche finale</li>
          </ol>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", marginBottom: "30px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ background: "#f8f9fa", padding: "25px", borderRadius: "15px", border: "2px dashed #0D7702" }}>
            <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "1.5em" }}>📸 Votre Photo</h2>
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <label
                htmlFor="userImage"
                style={{
                  display: "block",
                  padding: "15px",
                  background: "#0D7702",
                  color: "white",
                  borderRadius: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0a5d01";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(13, 119, 2, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0D7702";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                📁 Choisir une photo
              </label>
              <input
                ref={userImageInputRef}
                type="file"
                id="userImage"
                accept="image/*"
                style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer", top: 0, left: 0 }}
                onChange={handleImageUpload}
              />
            </div>
            <div>
              {previewImageSrc && (
                <img
                  src={previewImageSrc}
                  alt="Aperçu de votre photo"
                  style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)", marginTop: "15px" }}
                />
              )}
            </div>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                onClick={() => setShowAdjustSection(!showAdjustSection)}
                style={{
                  display: userImage ? "inline-block" : "none",
                  padding: "15px 30px",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1em",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: "#0D7702",
                  color: "white",
                  transition: "all 0.3s",
                }}
              >
                {showAdjustSection ? "✖️ Fermer l'ajustement" : "⚙️ Ajuster la photo dans le cercle"}
              </button>
            </div>
          </div>

          {showAdjustSection && (
            <div style={{ background: "#f8f9fa", padding: "25px", borderRadius: "15px", border: "2px dashed #0D7702", marginTop: "20px" }}>
              <h3 style={{ color: "#333", marginBottom: "15px", fontSize: "1.3em" }}>🎯 Ajustement de la photo</h3>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "15px" }}>
                Déplacez la photo avec la souris et ajustez le zoom pour un meilleur cadrage
              </p>
              <div
                style={{
                  position: "relative",
                  width: "300px",
                  height: "300px",
                  margin: "20px auto",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #0D7702",
                  cursor: isAdjusting ? "grabbing" : "move",
                  background: "#fff",
                }}
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <canvas ref={adjustPreviewCanvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", marginTop: "20px", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold", color: "#333" }}>Zoom:</label>
                <input
                  type="range"
                  id="zoomSlider"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={photoAdjustment.scale}
                  onChange={handleZoomChange}
                  style={{ width: "200px", margin: "0 10px" }}
                />
                <span id="zoomValue">{Math.round(photoAdjustment.scale * 100)}%</span>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", marginTop: "15px", flexWrap: "wrap" }}>
                <label style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>Déplacer la photo:</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", maxWidth: "200px", margin: "0 auto" }}>
                  <div></div>
                  <button
                    onClick={() => movePhoto(0, -5)}
                    style={{ padding: "10px", background: "#F13D06", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                  >
                    ↑
                  </button>
                  <div></div>
                  <button
                    onClick={() => movePhoto(-5, 0)}
                    style={{ padding: "10px", background: "#F13D06", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                  >
                    ←
                  </button>
                  <button
                    onClick={resetAdjustment}
                    style={{ padding: "10px", background: "#F13D06", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                  >
                    ↺
                  </button>
                  <button
                    onClick={() => movePhoto(5, 0)}
                    style={{ padding: "10px", background: "#F13D06", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                  >
                    →
                  </button>
                  <div></div>
                  <button
                    onClick={() => movePhoto(0, 5)}
                    style={{ padding: "10px", background: "#F13D06", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                  >
                    ↓
                  </button>
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "#f8f9fa", padding: "25px", borderRadius: "15px", textAlign: "center" }}>
          <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "1.5em" }}>✨ Votre Affiche Personnalisée</h2>
          {loading && <div style={{ textAlign: "center", padding: "20px", color: "#0D7702", fontWeight: "bold" }}>Chargement en cours...</div>}
          <canvas
            ref={canvasRef}
            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)", background: "white" }}
          />
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              onClick={generatePoster}
              disabled={!isPosterLoaded || !userImage || loading}
              style={{
                padding: "15px 30px",
                border: "none",
                borderRadius: "10px",
                fontSize: "1em",
                fontWeight: "bold",
                cursor: !isPosterLoaded || !userImage || loading ? "not-allowed" : "pointer",
                background: "#0D7702",
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: !isPosterLoaded || !userImage || loading ? 0.5 : 1,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!(!isPosterLoaded || !userImage || loading)) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(13, 119, 2, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Générer l'affiche
            </button>
            <button
              onClick={downloadPoster}
              disabled={!canvasRef.current?.width || loading}
              style={{
                padding: "15px 30px",
                border: "none",
                borderRadius: "10px",
                fontSize: "1em",
                fontWeight: "bold",
                cursor: !canvasRef.current?.width || loading ? "not-allowed" : "pointer",
                background: "#F13D06",
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: !canvasRef.current?.width || loading ? 0.5 : 1,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!(!canvasRef.current?.width || loading)) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(241, 61, 6, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Télécharger l'affiche
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px", padding: "20px", color: "#a1a0a0", fontSize: "0.9em", borderTop: "1px solid #e0e0e0" }}>
          Développé par <span style={{ fontWeight: "bold", color: "#bfc0c9", fontSize: "1.1em" }}>Chaibouu</span>
        </div>
      </div>
    </div>
  );
}

