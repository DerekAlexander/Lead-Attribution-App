import Dashboard from "@/app/components/Dashboard";
import { mockDashboardData } from "@/app/lib/mockData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Hydrodub Shop SEO",
};

export default function DashboardPage() {
  return <Dashboard clientName="Demo Client" data={mockDashboardData} />;
}
