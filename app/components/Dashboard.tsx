"use client";

import React, { useState } from "react";
import { brandConfig } from "@/app/config/branding";
import { mockDashboardData } from "@/app/lib/mockData";
import ScoreCard from "./ScoreCard";
import MetricsGrid from "./MetricsGrid";
import Phase1Checklist from "./Phase1Checklist";
import IssuesFixedTicker from "./IssuesFixedTicker";
import PDFExport from "./PDFExport";

export default function Dashboard() {
  const [clientName, setClientName] = useState("Bandera Jewelers");

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
          <PDFExport clientName={clientName} data={mockDashboardData} />
        </div>
        <p style={{ color: brandConfig.colors.textSecondary }} className="text-sm">
          SEO Performance Dashboard for {clientName}
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Score Card */}
        <ScoreCard data={mockDashboardData} />

        {/* Metrics Grid */}
        <MetricsGrid metrics={mockDashboardData.metrics} />

        {/* Phase 1 Checklist + Issues Fixed (Side by side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Phase1Checklist checklist={mockDashboardData.phase1Checklist} />
          <IssuesFixedTicker issues={mockDashboardData.issuesFixed} />
        </div>
      </div>
    </div>
  );
}
