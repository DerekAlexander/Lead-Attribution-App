'use client';

export default function DashboardHome() {
  // Mock data - will be replaced with GA4 data
  const weeklyData = {
    leadsThisWeek: 12,
    conversionsThisWeek: 8,
    weeklyROI: 340,
    weeklyRevenue: 4200,
    sources: [
      { name: 'Organic Search', leads: 6, conversion: 75 },
      { name: 'Google Local', leads: 4, conversion: 50 },
      { name: 'Direct', leads: 2, conversion: 25 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Leads This Week</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {weeklyData.leadsThisWeek}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 25% vs last week</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Conversions</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {weeklyData.conversionsThisWeek}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            {Math.round((weeklyData.conversionsThisWeek / weeklyData.leadsThisWeek) * 100)}% conv rate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Weekly ROI</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {weeklyData.weeklyROI}%
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Return on investment</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Weekly Revenue</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            ${weeklyData.weeklyRevenue}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Est. lead value</p>
        </div>
      </div>

      {/* Sources Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Traffic Sources</h2>
        <div className="space-y-3">
          {weeklyData.sources.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{source.name}</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(source.conversion / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{source.leads}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{source.conversion} conv</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
