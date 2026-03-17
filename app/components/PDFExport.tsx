"use client";

import React from "react";
import { brandConfig } from "@/app/config/branding";

interface PDFExportProps {
  clientName: string;
  data: any;
}

export default function PDFExport({ clientName, data }: PDFExportProps) {
  const handleExport = async () => {
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          data,
          branding: {
            company: brandConfig.company,
            colors: brandConfig.colors,
          },
        }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${clientName}-SEO-Dashboard-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF. Check console for details.");
    }
  };

  return (
    <button
      onClick={handleExport}
      style={{
        backgroundColor: brandConfig.colors.accent,
        color: "#000",
      }}
      className="px-4 py-2 rounded font-semibold text-sm hover:opacity-90 transition"
    >
      📥 Export PDF
    </button>
  );
}
