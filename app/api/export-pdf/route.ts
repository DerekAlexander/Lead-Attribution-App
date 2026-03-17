import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientName, data, branding } = await request.json();

    // Basic HTML to PDF conversion
    // For production, use a library like html2pdf or jsPDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${clientName} SEO Dashboard</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #0f172a;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid ${branding.colors.accent};
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company { color: ${branding.colors.accent}; font-size: 24px; font-weight: bold; }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .score-large { font-size: 48px; font-weight: bold; color: ${branding.colors.accent}; }
            .metric-box {
              border: 1px solid #ddd;
              padding: 15px;
              margin-bottom: 10px;
              border-left: 4px solid ${branding.colors.accent};
            }
            .checklist-item { margin-bottom: 8px; }
            .completed { text-decoration: line-through; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">${branding.company}</div>
            <p>SEO Dashboard for ${clientName}</p>
            <p style="font-size: 12px; color: #666;">Generated ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>SEO Score</h2>
            <p><span class="score-large">${data.score}/${data.scoreMax}</span></p>
            <p>${data.scoreTrend}</p>
          </div>

          <div class="section">
            <h2>Key Metrics</h2>
            <div class="metric-box">
              <strong>Organic Traffic:</strong> ${data.metrics.organicTraffic.value}% (${data.metrics.organicTraffic.change})
            </div>
            <div class="metric-box">
              <strong>Top Ranking:</strong> ${data.metrics.topRanking.value} for "${data.metrics.topRanking.subtitle}"
            </div>
            <div class="metric-box">
              <strong>Reviews:</strong> ${data.metrics.reviews.value} (${data.metrics.reviews.change})
            </div>
          </div>

          <div class="section">
            <h2>Phase 1 Checklist</h2>
            ${data.phase1Checklist
              .map(
                (item: any) => `
              <div class="checklist-item ${item.completed ? "completed" : ""}">
                ${item.completed ? "✓" : "○"} ${item.task}
              </div>
            `
              )
              .join("")}
          </div>

          <div class="section">
            <h2>Recent Fixes</h2>
            ${data.issuesFixed
              .map(
                (issue: any) => `
              <div class="metric-box">
                <p style="margin: 0; font-size: 12px; color: #666;">${issue.date}</p>
                <p style="margin: 5px 0 0 0;">${issue.issue}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `;

    // For now, return JSON. In production, use html2pdf or similar
    return NextResponse.json({ status: "PDF generation requires html2pdf library" });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
