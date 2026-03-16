'use client';

import { useState } from 'react';
import DashboardHome from './components/DashboardHome';
import LeadsBreakdown from './components/LeadsBreakdown';
import Settings from './components/Settings';

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'leads', or 'settings'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">🎯 Lead Attribution</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('leads')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'leads'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Leads Breakdown
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardHome />}
        {currentView === 'leads' && <LeadsBreakdown />}
        {currentView === 'settings' && <Settings />}
      </main>
    </div>
  );
}
