'use client';

import { useState, useEffect } from 'react';

export default function OnboardingChecklist({ isDarkMode = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [checklist, setChecklist] = useState({
    businessName: false,
    jobTypes: false,
    smsWebhook: false,
    firstLead: false,
  });
  const [jobTypeCount, setJobTypeCount] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);

  // Load checklist state from localStorage
  useEffect(() => {
    const businessName = localStorage.getItem('businessName');
    const selectedJobTypes = localStorage.getItem('selectedJobTypes');
    const smsConnected = localStorage.getItem('twilioConnected');
    const setupCompleteFlag = localStorage.getItem('setupComplete');
    const leadsData = localStorage.getItem('leads');

    const jobTypes = selectedJobTypes ? JSON.parse(selectedJobTypes) : [];
    const leads = leadsData ? JSON.parse(leadsData) : [];

    setChecklist({
      businessName: !!businessName,
      jobTypes: jobTypes.length > 0,
      smsWebhook: !!smsConnected,
      firstLead: leads.length > 0,
    });

    setJobTypeCount(jobTypes.length);
    setSetupComplete(!!setupCompleteFlag);

    // Collapse if setup is complete
    if (setupCompleteFlag) {
      setIsCollapsed(true);
    }
  }, []);

  // Listen for storage changes (to sync across components)
  useEffect(() => {
    const handleStorageChange = () => {
      const businessName = localStorage.getItem('businessName');
      const selectedJobTypes = localStorage.getItem('selectedJobTypes');
      const smsConnected = localStorage.getItem('twilioConnected');
      const leadsData = localStorage.getItem('leads');

      const jobTypes = selectedJobTypes ? JSON.parse(selectedJobTypes) : [];
      const leads = leadsData ? JSON.parse(leadsData) : [];

      setChecklist({
        businessName: !!businessName,
        jobTypes: jobTypes.length > 0,
        smsWebhook: !!smsConnected,
        firstLead: leads.length > 0,
      });

      setJobTypeCount(jobTypes.length);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events from other components
    window.addEventListener('onboarding-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('onboarding-update', handleStorageChange);
    };
  }, []);

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = 4;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 shadow-xl rounded-lg overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'dark' : ''
      }`}
    >
      {/* Collapsed Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-lg transition-transform hover:scale-110"
          title="Setup Progress"
        >
          <span className="text-2xl">✓</span>
        </button>
      )}

      {/* Expanded Panel */}
      {!isCollapsed && (
        <div className="bg-white dark:bg-slate-800 w-80 shadow-2xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold text-lg">Setup Progress</h3>
              <p className="text-blue-100 text-sm">
                {completedCount} of {totalCount} complete
              </p>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              title="Minimize"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="p-4 space-y-3">
            {/* Business Name */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                  checklist.businessName
                    ? 'bg-green-500 border-green-600'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {checklist.businessName && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm">Business name set</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {checklist.businessName
                    ? localStorage.getItem('businessName')
                    : 'Add your business name'}
                </p>
              </div>
            </div>

            {/* Job Types */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                  checklist.jobTypes
                    ? 'bg-green-500 border-green-600'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {checklist.jobTypes && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm">Job types configured</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {checklist.jobTypes
                    ? `${jobTypeCount} job type${jobTypeCount !== 1 ? 's' : ''} added`
                    : 'Select job types to track'}
                </p>
              </div>
            </div>

            {/* SMS Webhook */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors opacity-75">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                  checklist.smsWebhook
                    ? 'bg-green-500 border-green-600'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {checklist.smsWebhook && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  SMS webhook connected
                  <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">
                    (optional)
                  </span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {checklist.smsWebhook ? 'Twilio is connected' : 'Set up in Settings'}
                </p>
              </div>
            </div>

            {/* First Lead */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                  checklist.firstLead
                    ? 'bg-green-500 border-green-600'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {checklist.firstLead && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm">First lead added</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {checklist.firstLead
                    ? 'You have at least 1 lead'
                    : 'Add your first lead to begin'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          {completedCount === totalCount ? (
            <div className="px-4 pb-4">
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3 text-center">
                <p className="text-green-900 dark:text-green-100 text-sm font-semibold">
                  🎉 Setup Complete!
                </p>
                <p className="text-green-800 dark:text-green-200 text-xs mt-1">
                  You're ready to start tracking leads.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-4 pb-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                Complete setup to unlock full features
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
