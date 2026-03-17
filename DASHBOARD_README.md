# Hydrodub Shop SEO Dashboard

**Status:** MVP UI complete, mock data ready, technical & clean design implemented.

## Overview

Single-client SEO dashboard showing real-time performance metrics, Phase 1 implementation progress, and weekly issue fixes.

**Colors:** Deep blue (#1e3a5f) + green accent (#10b981)  
**Tech Stack:** Next.js 16, React, Tailwind CSS  
**Tone:** Technical, data-focused, minimal

## Features (MVP)

✅ **Score Card** — Real-time SEO score with animated progress ring  
✅ **Key Metrics** — Organic traffic %, top ranking, review count  
✅ **Phase 1 Checklist** — Task progress with green checkmarks  
✅ **Issues Fixed Ticker** — Auto-rotating list of recent improvements  
✅ **PDF Export** — Download report button (requires html2pdf library)  
✅ **White-label Ready** — Logo, colors, company name configurable via `branding.ts`

## File Structure

```
app/
├── config/
│   └── branding.ts          # Branding config (colors, company name, logo)
├── lib/
│   └── mockData.ts          # Mock data (replace with GSC API later)
├── components/
│   ├── Dashboard.tsx        # Main dashboard component
│   ├── ScoreCard.tsx        # Score with animated progress ring
│   ├── MetricsGrid.tsx      # Top 3 metrics
│   ├── Phase1Checklist.tsx  # Implementation checklist
│   ├── IssuesFixedTicker.tsx # Auto-rotating fixes list
│   └── PDFExport.tsx        # Export button
├── api/
│   └── export-pdf/
│       └── route.ts         # PDF export endpoint (stub)
└── dashboard/
    └── page.tsx             # Dashboard page
```

## Setup & Run

```bash
cd dashboard-build
npm install
npm run dev
```

Then visit: `http://localhost:3000/dashboard`

## Swapping in Real GSC Data (Later)

**Current:** Mock data in `app/lib/mockData.ts`

**To integrate real Google Search Console data:**

1. Create `app/lib/gscAPI.ts` with GSC Reporting API client
2. In `app/components/Dashboard.tsx`, replace:
   ```typescript
   const data = mockDashboardData;
   ```
   with:
   ```typescript
   const data = await fetchGSCData(domain);
   ```
3. Pass GSC credentials via environment variables

**Data shape** (same for mock and real):
```typescript
{
  score: number,
  scoreMax: number,
  scoreTrend: string,
  metrics: {
    organicTraffic: { value, label, unit, change, changeTrend },
    topRanking: { value, label, subtitle, change, changeTrend },
    reviews: { value, label, change, changeTrend }
  },
  phase1Checklist: [{ id, task, completed }],
  issuesFixed: [{ date, issue }]
}
```

## Customization

### Change Branding
Edit `app/config/branding.ts`:
```typescript
logoUrl: "https://your-logo-url.png",
colors: {
  primary: "#1e3a5f",
  accent: "#10b981",
  // ...
}
```

### Update Mock Data
Edit `app/lib/mockData.ts` to reflect current metrics.

### Add More Metrics
1. Add metric to `mockData.ts`
2. Render in `MetricsGrid.tsx`

## PDF Export (TODO)

Currently returns a stub. To enable:

```bash
npm install html2pdf
```

Then update `app/api/export-pdf/route.ts` to use html2pdf library.

## Next Steps

- [ ] Integrate real GSC data (requires OAuth setup)
- [ ] PDF export library (html2pdf)
- [ ] Multi-client admin dashboard (Phase 2)
- [ ] Real logo upload
- [ ] Client login/access control

---

**Questions?** Check the component files — each is well-commented and self-contained.
