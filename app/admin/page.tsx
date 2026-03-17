"use client";

import { getAllClients } from "@/app/lib/clientData";
import { brandConfig } from "@/app/config/branding";
import Link from "next/link";

export default function AdminPage() {
  const clients = getAllClients();

  return (
    <div
      style={{ backgroundColor: brandConfig.colors.background, color: brandConfig.colors.text }}
      className="min-h-screen p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p style={{ color: brandConfig.colors.textSecondary }}>
            Manage all client dashboards
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/${client.id}`}
              className="group"
            >
              <div
                style={{
                  backgroundColor: brandConfig.colors.primary,
                  borderTop: `4px solid ${brandConfig.colors.accent}`,
                }}
                className="p-6 rounded-lg cursor-pointer hover:opacity-90 transition"
              >
                {/* Client Name */}
                <h2 className="text-xl font-bold mb-1">{client.name}</h2>
                <p style={{ color: brandConfig.colors.textSecondary }} className="text-sm mb-4">
                  {client.domain}
                </p>

                {/* Score */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span
                    style={{ color: brandConfig.colors.accent }}
                    className="text-3xl font-bold"
                  >
                    {client.score}
                  </span>
                  <span style={{ color: brandConfig.colors.textSecondary }} className="text-lg">
                    / {client.scoreMax}
                  </span>
                </div>

                {/* Metrics Preview */}
                <div className="space-y-2 mb-6">
                  <div
                    style={{
                      backgroundColor: brandConfig.colors.border,
                      borderLeft: `3px solid ${brandConfig.colors.accent}`,
                    }}
                    className="p-3 rounded text-sm"
                  >
                    <p style={{ color: brandConfig.colors.textSecondary }}>Organic Traffic</p>
                    <p className="font-semibold">
                      {client.metrics.organicTraffic.value}%{" "}
                      <span style={{ color: brandConfig.colors.accent }}>
                        {client.metrics.organicTraffic.change}
                      </span>
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: brandConfig.colors.border,
                      borderLeft: `3px solid ${brandConfig.colors.accent}`,
                    }}
                    className="p-3 rounded text-sm"
                  >
                    <p style={{ color: brandConfig.colors.textSecondary }}>Best Ranking</p>
                    <p className="font-semibold">
                      {client.metrics.topRanking.value}{" "}
                      <span
                        style={{ color: brandConfig.colors.textSecondary }}
                        className="text-xs"
                      >
                        {client.metrics.topRanking.subtitle}
                      </span>
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: brandConfig.colors.border,
                      borderLeft: `3px solid ${brandConfig.colors.accent}`,
                    }}
                    className="p-3 rounded text-sm"
                  >
                    <p style={{ color: brandConfig.colors.textSecondary }}>Reviews</p>
                    <p className="font-semibold">
                      {client.metrics.reviews.value}{" "}
                      <span style={{ color: brandConfig.colors.accent }}>
                        {client.metrics.reviews.change}
                      </span>
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  style={{
                    backgroundColor: brandConfig.colors.accent,
                    color: "#000",
                  }}
                  className="w-full py-2 rounded font-semibold text-sm group-hover:opacity-80 transition"
                >
                  View Dashboard →
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Add Client Placeholder */}
        <div
          style={{
            backgroundColor: brandConfig.colors.primary,
            borderTop: `4px dashed ${brandConfig.colors.border}`,
          }}
          className="p-6 rounded-lg mt-6 flex items-center justify-center h-48"
        >
          <div className="text-center">
            <p style={{ color: brandConfig.colors.textSecondary }} className="text-sm mb-2">
              Add new client
            </p>
            <p className="text-2xl">+</p>
            <p style={{ color: brandConfig.colors.textSecondary }} className="text-xs mt-2">
              Edit app/lib/clientData.ts to add more clients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
