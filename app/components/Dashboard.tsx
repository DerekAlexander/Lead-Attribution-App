"use client";

import React from "react";
import { brandConfig } from "@/app/config/branding";
import ScoreCard from "./ScoreCard";
import MetricsGrid from "./MetricsGrid";
import Phase1Checklist from "./Phase1Checklist";
import IssuesFixedTicker from "./IssuesFixedTicker";
import PDFExport from "./PDFExport";
import { ClientData } from "@/app/lib/clientData";

interface DashboardProps {
  clientName: string;
  data: ClientData;
}

export default function Dashboard({ clientName, data }: DashboardProps) {
  return (
    <div
      style={{
        backgroundColor: brandConfig.colors.background,
        color: brandConfig.colors.text,
      }}
      className="min-h-screen p-8"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-2">
          {brandConfig.logoUrl ? (
            <img src={brandConfig.logoUrl} alt="Logo" className="h-8" />
          ) : (
            <div
              style={{ color: brandConfig.colors.accent }}
              className="text-2xl font-bold"
            >
              {brandConfig.company}
            </div>
          )}
          <PDFExport clientName={clientName} data={data} />
        </div>
        <p style={{ color: brandConfig.colors.textSecondary }} className="text-sm">
          SEO Performance Dashboard for {clientName}
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Score Card */}
        <ScoreCard data={data} />

        {/* Metrics Grid */}
        <MetricsGrid metrics={data.metrics} />

        {/* Phase 1 Checklist + Issues Fixed (Side by side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Phase1Checklist checklist={data.phase1Checklist} />
          <IssuesFixedTicker issues={data.issuesFixed} />
        </div>
      </div>
    </div>
  );
}
