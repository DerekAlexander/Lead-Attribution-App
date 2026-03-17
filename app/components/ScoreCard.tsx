"use client";

import React from "react";
import { brandConfig } from "@/app/config/branding";

interface ScoreCardProps {
  data: {
    score: number;
    scoreMax: number;
    scoreTrend: string;
  } | any;
}

export default function ScoreCard({ data }: ScoreCardProps) {
  const scorePercent = (data.score / data.scoreMax) * 100;
  const isImproving = data.scoreTrend.startsWith("+");

  return (
    <div
      style={{
        backgroundColor: brandConfig.colors.primary,
        borderLeft: `4px solid ${brandConfig.colors.accent}`,
      }}
      className="p-8 rounded-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: brandConfig.colors.textSecondary }} className="text-sm uppercase tracking-wide mb-2">
            SEO Score
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold">{data.score}</span>
            <span style={{ color: brandConfig.colors.textSecondary }} className="text-xl">
              / {data.scoreMax}
            </span>
          </div>
          <p
            style={{ color: isImproving ? brandConfig.colors.accent : "#ef4444" }}
            className="text-sm mt-2 font-semibold"
          >
            {isImproving ? "📈" : "📉"} {data.scoreTrend} this month
          </p>
        </div>

        {/* Progress Ring */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={brandConfig.colors.border}
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={brandConfig.colors.accent}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(scorePercent / 100) * 339.29} 339.29`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{scorePercent.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
