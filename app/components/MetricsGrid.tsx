"use client";

import React from "react";
import { brandConfig } from "@/app/config/branding";

interface Metric {
  value: string | number;
  label: string;
  subtitle?: string;
  unit?: string;
  change?: string;
  changeTrend?: "up" | "down";
}

interface MetricsGridProps {
  metrics: {
    organicTraffic: Metric;
    topRanking: Metric;
    reviews: Metric;
  };
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const renderMetric = (metric: Metric, index: number) => {
    const isPositive = metric.changeTrend === "up";

    return (
      <div
        key={index}
        style={{
          backgroundColor: brandConfig.colors.primary,
          borderTop: `3px solid ${brandConfig.colors.accent}`,
        }}
        className="p-6 rounded-lg"
      >
        <p style={{ color: brandConfig.colors.textSecondary }} className="text-xs uppercase tracking-wide mb-3">
          {metric.label}
        </p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-bold">{metric.value}</span>
          {metric.unit && (
            <span style={{ color: brandConfig.colors.textSecondary }} className="text-lg">
              {metric.unit}
            </span>
          )}
        </div>

        {metric.subtitle && (
          <p style={{ color: brandConfig.colors.textSecondary }} className="text-sm mb-3">
            {metric.subtitle}
          </p>
        )}

        {metric.change && (
          <p
            style={{
              color: isPositive ? brandConfig.colors.accent : "#ef4444",
            }}
            className="text-sm font-semibold"
          >
            {isPositive ? "↑" : "↓"} {metric.change}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {renderMetric(metrics.organicTraffic, 0)}
      {renderMetric(metrics.topRanking, 1)}
      {renderMetric(metrics.reviews, 2)}
    </div>
  );
}
