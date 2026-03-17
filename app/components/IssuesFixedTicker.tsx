"use client";

import React, { useEffect, useState } from "react";
import { brandConfig } from "@/app/config/branding";

interface Issue {
  date: string;
  issue: string;
}

interface IssuesFixedTickerProps {
  issues: Issue[];
}

export default function IssuesFixedTicker({ issues }: IssuesFixedTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % issues.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [issues.length]);

  const current = issues[currentIndex];

  return (
    <div
      style={{ backgroundColor: brandConfig.colors.primary }}
      className="p-6 rounded-lg"
    >
      <h3 className="text-lg font-bold mb-6">Issues Fixed This Week</h3>

      <div
        style={{
          backgroundColor: brandConfig.colors.border,
          borderLeft: `4px solid ${brandConfig.colors.accent}`,
        }}
        className="p-4 rounded"
      >
        <p style={{ color: brandConfig.colors.textSecondary }} className="text-xs mb-2">
          {current.date}
        </p>
        <p className="text-sm leading-relaxed">{current.issue}</p>
      </div>

      {/* Indicators */}
      <div className="flex gap-2 mt-6 justify-center">
        {issues.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              backgroundColor:
                index === currentIndex
                  ? brandConfig.colors.accent
                  : brandConfig.colors.border,
            }}
            className="w-2 h-2 rounded-full transition-all duration-300"
            aria-label={`Go to issue ${index + 1}`}
          />
        ))}
      </div>

      {/* Info Text */}
      <p
        style={{ color: brandConfig.colors.textSecondary }}
        className="text-xs text-center mt-4"
      >
        {currentIndex + 1} of {issues.length}
      </p>
    </div>
  );
}
