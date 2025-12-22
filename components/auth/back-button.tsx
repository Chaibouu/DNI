"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
};

export const BackButton = ({
  href,
  label,
}: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full"
      size="sm"
      asChild
      style={{ color: "#0D7702" }}
    >
      <Link 
        href={href}
        style={{ color: "#0D7702" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F13D06";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#0D7702";
        }}
      >
        {label}
      </Link>
    </Button>
  );
};