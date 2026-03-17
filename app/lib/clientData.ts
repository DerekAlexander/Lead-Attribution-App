// Client Data - Centralized list of all clients and their dashboard data
export interface ClientData {
  id: string;
  name: string;
  domain: string;
  score: number;
  scoreMax: number;
  scoreTrend: string;
  metrics: {
    organicTraffic: {
      value: number;
      label: string;
      unit: string;
      change: string;
      changeTrend: "up" | "down";
    };
    topRanking: {
      value: string;
      label: string;
      subtitle: string;
      change: string;
      changeTrend: "up" | "down";
    };
    reviews: {
      value: number;
      label: string;
      change: string;
      changeTrend: "up" | "down";
    };
  };
  phase1Checklist: Array<{ id: number; task: string; completed: boolean }>;
  issuesFixed: Array<{ date: string; issue: string }>;
}

export const clients: Record<string, ClientData> = {
  "bandera-jewelers": {
    id: "bandera-jewelers",
    name: "Bandera Jewelers",
    domain: "texashillcountrygoldbuyers.com",
    score: 6.5,
    scoreMax: 10,
    scoreTrend: "+0.3",
    metrics: {
      organicTraffic: {
        value: 12,
        label: "Organic Traffic",
        unit: "%",
        change: "+12%",
        changeTrend: "up" as const,
      },
      topRanking: {
        value: "#4",
        label: "Best Ranking",
        subtitle: "Gold Buyers Near Me",
        change: "↑2 positions",
        changeTrend: "up" as const,
      },
      reviews: {
        value: 28,
        label: "Reviews",
        change: "+3 this month",
        changeTrend: "up" as const,
      },
    },
    phase1Checklist: [
      { id: 1, task: "Remove noindex tag", completed: true },
      { id: 2, task: "Fix local business schema", completed: true },
      { id: 3, task: "Optimize meta descriptions", completed: false },
      { id: 4, task: "Add review schema markup", completed: false },
      { id: 5, task: "Submit to Google Search Console", completed: true },
    ],
    issuesFixed: [
      { date: "2026-03-16", issue: "Schema markup added for LocalBusiness" },
      { date: "2026-03-15", issue: "Page speed improved from 65 to 78 (mobile)" },
      { date: "2026-03-14", issue: "Fixed Yelp review collection link" },
      { date: "2026-03-13", issue: "Removed noindex tag from pages" },
    ],
  },
  "alexander-roofing": {
    id: "alexander-roofing",
    name: "Alexander's Roofing",
    domain: "alexandersroofing.com",
    score: 7.0,
    scoreMax: 10,
    scoreTrend: "+0.5",
    metrics: {
      organicTraffic: {
        value: 18,
        label: "Organic Traffic",
        unit: "%",
        change: "+18%",
        changeTrend: "up" as const,
      },
      topRanking: {
        value: "#2",
        label: "Best Ranking",
        subtitle: "Roof Repair Austin",
        change: "↑3 positions",
        changeTrend: "up" as const,
      },
      reviews: {
        value: 156,
        label: "Reviews",
        change: "+12 this month",
        changeTrend: "up" as const,
      },
    },
    phase1Checklist: [
      { id: 1, task: "Remove noindex tag", completed: true },
      { id: 2, task: "Optimize Thryv meta tags", completed: true },
      { id: 3, task: "Add Service schema", completed: true },
      { id: 4, task: "Review LocalBusiness markup", completed: true },
      { id: 5, task: "Submit XML sitemap", completed: true },
    ],
    issuesFixed: [
      { date: "2026-03-16", issue: "Service schema added for all service pages" },
      { date: "2026-03-15", issue: "Core Web Vitals improved to 85+ score" },
      { date: "2026-03-14", issue: "Internal linking structure optimized" },
      { date: "2026-03-13", issue: "Meta descriptions rewritten for all pages" },
    ],
  },
};

export function getClient(clientId: string): ClientData | null {
  return clients[clientId] || null;
}

export function getAllClients(): ClientData[] {
  return Object.values(clients);
}
