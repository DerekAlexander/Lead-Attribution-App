"use client";

import React from "react";
import { brandConfig } from "@/app/config/branding";

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
}

interface Phase1ChecklistProps {
  checklist: ChecklistItem[];
}

export default function Phase1Checklist({ checklist }: Phase1ChecklistProps) {
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const percentComplete = (completedCount / totalCount) * 100;

  return (
    <div
      style={{ backgroundColor: brandConfig.colors.primary }}
      className="p-6 rounded-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Phase 1 Implementation</h3>
        <span
          style={{ color: brandConfig.colors.accent }}
          className="text-sm font-semibold"
        >
          {completedCount}/{totalCount} Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{ backgroundColor: brandConfig.colors.border }}
        className="h-2 rounded-full mb-6 overflow-hidden"
      >
        <div
          style={{
            backgroundColor: brandConfig.colors.accent,
            width: `${percentComplete}%`,
          }}
          className="h-full transition-all duration-500"
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              style={{
                backgroundColor: item.completed
                  ? brandConfig.colors.accent
                  : brandConfig.colors.border,
              }}
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              {item.completed && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <span
              style={{
                color: item.completed
                  ? brandConfig.colors.textSecondary
                  : brandConfig.colors.text,
                textDecoration: item.completed ? "line-through" : "none",
              }}
              className="text-sm"
            >
              {item.task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
