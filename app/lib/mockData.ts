// Mock Dashboard Data (replace with real GSC data later)
export const mockDashboardData = {
  score: 7.2,
  scoreMax: 10,
  scoreTrend: "+0.2",
  
  metrics: {
    organicTraffic: {
      value: 15,
      label: "Organic Traffic",
      unit: "%",
      change: "+15%",
      changeTrend: "up",
    },
    topRanking: {
      value: "#3",
      label: "Best Ranking",
      subtitle: "Best Roofing in Austin",
      change: "↑1 position",
      changeTrend: "up",
    },
    reviews: {
      value: 42,
      label: "Reviews",
      change: "+5 this month",
      changeTrend: "up",
    },
  },

  phase1Checklist: [
    { id: 1, task: "Remove noindex tag", completed: true },
    { id: 2, task: "Fix Yelp/Yellow Pages phone numbers", completed: true },
    { id: 3, task: "Resubmit to Google Search Console", completed: true },
    { id: 4, task: "Add Review schema markup", completed: false },
    { id: 5, task: "Optimize meta descriptions", completed: false },
  ],

  issuesFixed: [
    { date: "2026-03-16", issue: "Meta description optimized for 'roof repair Austin'" },
    { date: "2026-03-15", issue: "Page speed improved from 68 to 82 (mobile)" },
    { date: "2026-03-14", issue: "Fixed broken internal link on Services page" },
    { date: "2026-03-13", issue: "Added LocalBusiness schema markup" },
    { date: "2026-03-12", issue: "Submitted sitemap to Google Search Console" },
  ],
};
