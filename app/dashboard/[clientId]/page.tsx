"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard";
import { getClient, getAllClients, ClientData } from "@/app/lib/clientData";
import { brandConfig } from "@/app/config/branding";

export default function ClientDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [allClients, setAllClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getClient(clientId);
    const clients = getAllClients();

    if (!data) {
      // Client not found, redirect to admin
      router.push("/admin");
      return;
    }

    setClientData(data);
    setAllClients(clients);
    setLoading(false);
  }, [clientId, router]);

  if (loading) {
    return (
      <div
        style={{ backgroundColor: brandConfig.colors.background, color: brandConfig.colors.text }}
        className="min-h-screen flex items-center justify-center"
      >
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div
        style={{ backgroundColor: brandConfig.colors.background, color: brandConfig.colors.text }}
        className="min-h-screen flex items-center justify-center"
      >
        <p>Client not found</p>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: brandConfig.colors.background, color: brandConfig.colors.text }}
      className="min-h-screen"
    >
      {/* Header with Client Selector */}
      <div
        style={{ backgroundColor: brandConfig.colors.primary, borderBottom: `1px solid ${brandConfig.colors.border}` }}
        className="p-4 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p style={{ color: brandConfig.colors.textSecondary }} className="text-xs uppercase tracking-wide">
              Client Dashboard
            </p>
            <p className="text-lg font-semibold">{clientData.name}</p>
          </div>

          {/* Client Dropdown */}
          <select
            value={clientId}
            onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
            style={{
              backgroundColor: brandConfig.colors.border,
              color: brandConfig.colors.text,
              borderColor: brandConfig.colors.accent,
            }}
            className="px-3 py-2 rounded border-2 text-sm font-medium cursor-pointer"
          >
            {allClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          {/* Link to Admin */}
          <a
            href="/admin"
            style={{ color: brandConfig.colors.accent }}
            className="text-sm font-semibold hover:opacity-80 transition"
          >
            ← Back to Admin
          </a>
        </div>
      </div>

      {/* Dashboard Content */}
      <Dashboard clientName={clientData.name} data={clientData} />
    </div>
  );
}
