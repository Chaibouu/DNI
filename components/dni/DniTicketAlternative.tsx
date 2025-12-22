"use client";

import { DniParticipant } from "@prisma/client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { forwardRef } from "react";

interface DniTicketAlternativeProps {
  participant: DniParticipant;
}

const categoryLabels: Record<string, string> = {
  PROFESSIONNEL: "Professionnel",
  ETUDIANT: "Étudiant",
  CHOMAGE: "Au chômage",
  RETRAITE: "Retraité",
  ENTREPRENEUR: "Entrepreneur",
  AUTRE: "Autre",
};

export const DniTicketAlternative = forwardRef<HTMLDivElement, DniTicketAlternativeProps>(
  ({ participant }, ref) => {
    return (
      <div 
        ref={ref}
        data-ticket-container
        className="relative w-full max-w-[650px] mx-auto"
        style={{ 
          minHeight: "280px",
          height: "auto",
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          overflow: "hidden",
          border: "2px solid #0D7702",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
        }}
      >
      {/* En-tête avec gradient vert et accent orange */}
      <div 
        className="w-full flex items-center justify-between text-white relative px-3 sm:px-4 md:px-5 py-2 sm:py-3"
        style={{
          minHeight: "50px",
          background: "linear-gradient(135deg, #0D7702 0%, #0a5f02 100%)",
          position: "relative"
        }}
      >
        {/* Accent orange en bas de l'en-tête */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#F13D06"
        }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold m-0 truncate">DNI 2025</h2>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] m-0 opacity-90 truncate">Dialogue National Intergénérationnel</p>
        </div>
        <div className="text-right ml-2 flex-shrink-0">
          <p className="text-[7px] sm:text-[8px] md:text-[9px] m-0 opacity-90">Ticket d'entrée</p>
          <p className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-bold m-0 truncate" style={{ color: "#F13D06" }}>{participant.uniqueId}</p>
        </div>
      </div>

      {/* Corps du ticket */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Section gauche - Informations participant */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                style={{ borderRadius: "8px" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold m-0 truncate" style={{ 
                color: "#0D7702",
                lineHeight: "1.2"
              }}>
                {participant.firstName} {participant.lastName}
              </p>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] m-0 mt-1 uppercase font-semibold truncate" style={{ 
                color: "#F13D06",
                letterSpacing: "0.5px"
              }}>
                {categoryLabels[participant.category] || participant.category}
              </p>
            </div>
          </div>

          {/* Détails événement */}
          <div className="bg-gray-100 p-1.5 sm:p-2 md:p-2.5 rounded-lg mt-1 sm:mt-2" style={{ 
            borderLeft: "3px solid #F13D06"
          }}>
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-1.5 md:mb-2">
              <Icon icon="gis:location-poi" className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" style={{ color: "#0D7702" }} />
              <p className="text-[8px] sm:text-[9px] md:text-[10px] m-0 text-gray-700 font-medium truncate">
                Mahatma Ghandi
              </p>
            </div>
            <div className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
              <Icon icon="fluent-mdl2:date-time" className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#F13D06" }} />
              <p className="text-[8px] sm:text-[9px] md:text-[10px] m-0 text-gray-700 font-medium break-words">
                Du 30 au 31 Décembre 2025 - 08H00
              </p>
            </div>
          </div>
        </div>

        {/* Section droite - QR Code */}
        <div className="flex flex-col items-center justify-center sm:border-l-2 sm:border-dashed sm:border-[#F13D06] sm:pl-3 sm:ml-3 pt-2 sm:pt-0 border-t-2 border-dashed border-[#F13D06] sm:border-t-0 w-full sm:w-auto">
          {participant.qrCode ? (
            <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm" style={{ 
              border: "2px solid #F13D06"
            }}>
              <Image
                src={participant.qrCode}
                alt="QR Code"
                width={110}
                height={110}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                style={{ display: "block" }}
              />
            </div>
          ) : (
            <div 
              className="border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-100"
              style={{ 
                width: "64px",
                height: "64px",
                borderColor: "#F13D06"
              }}
            >
              <span className="text-[8px] sm:text-[10px] text-gray-500">QR Code</span>
            </div>
          )}
          <p className="text-[7px] sm:text-[8px] md:text-[9px] m-0 mt-1 sm:mt-2 text-center font-semibold px-2" style={{ 
            color: "#F13D06"
          }}>
            Présentez ce code à l'entrée
          </p>
        </div>
      </div>

      {/* Footer avec motif décoratif orange et vert */}
      <div 
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "12px",
          background: "repeating-linear-gradient(90deg, #0D7702 0px, #0D7702 8px, #F13D06 8px, #F13D06 16px)",
          opacity: 0.4
        }}
      />
    </div>
    );
  }
);

DniTicketAlternative.displayName = "DniTicketAlternative";

