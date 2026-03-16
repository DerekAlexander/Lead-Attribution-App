'use client';

import { useState, useEffect } from 'react';

const DEFAULT_STATUSES = [
  'Interested',
  'Awaiting Callback',
  'Waiting for Estimate',
  'New Lead',
];

export default function Settings() {
  const [jobTypes, setJobTypes] = useState([]);
  const [newJobType, setNewJobType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customJobTypes');
    if (saved) {
      try {
        setJobTypes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load job types:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever jobTypes changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('customJobTypes', JSON.stringify(jobTypes));
    }
  }, [jobTypes, loading]);

  const handleAddJobType = (e) => {
    e.preventDefault();
    setFeedback('');

    if (!newJobType.trim()) {
      setFeedback('❌ Job type cannot be empty');
      return;
    }

    if (jobTypes.includes(newJobType.trim())) {
      setFeedback('❌ This job type already exists');
      return;
    }

    setJobTypes([...jobTypes, newJobType.trim()]);
    setFeedback(`✅ Added: ${newJobType.trim()}`);
    setNewJobType('');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleDeleteJobType = (type) => {
    setJobTypes(jobTypes.filter((t) => t !== type));
    setFeedback(`🗑️ Removed: ${type}`);
    setTimeout(() => setFeedback(''), 2000);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">⚙️ Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Customize your lead tracking system. Define job types and manage statuses.
        </p>
      </div>

      {/* Default Statuses Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📋 Default Lead Statuses</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          These statuses are available for all contractors and cannot be modified.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEFAULT_STATUSES.map((status) => (
            <div
              key={status}
              className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-slate-900 dark:text-white">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Job Types Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">🏗️ Custom Job Types</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Create job types specific to your business (e.g., "Roof Repair", "Gutter Cleaning"). These will appear in your lead form.
        </p>

        {/* Add New Job Type Form */}
        <form onSubmit={handleAddJobType} className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newJobType}
              onChange={(e) => setNewJobType(e.target.value)}
              placeholder="e.g., Roof Repair, Gutter Cleaning, Inspection"
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          {feedback && (
            <div className="text-sm mt-2 p-2 rounded bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white">
              {feedback}
            </div>
          )}
        </form>

        {/* Job Types List */}
        {jobTypes.length > 0 ? (
          <div className="space-y-2">
            {jobTypes.map((type, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-slate-900 dark:text-white">{type}</span>
                </div>
                <button
                  onClick={() => handleDeleteJobType(type)}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            <p className="mb-2">No custom job types yet.</p>
            <p className="text-sm">Add one above to get started! 👆</p>
          </div>
        )}

        {/* Summary */}
        {jobTypes.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              ✅ You have <strong>{jobTypes.length}</strong> custom job type{jobTypes.length !== 1 ? 's' : ''}. These will appear in your lead form dropdown.
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">💡 How This Works</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>✓ <strong>Default statuses</strong> track the lead journey (Interested → Awaiting Callback → etc.)</li>
          <li>✓ <strong>Custom job types</strong> describe what the lead needs (Roof Repair, Inspection, etc.)</li>
          <li>✓ When a lead comes in, you'll select the <strong>job type</strong> + update its <strong>status</strong> as it progresses</li>
          <li>✓ Later, text "name completed" (e.g., "rawrbot completed") to mark the job as finished</li>
        </ul>
      </div>
    </div>
  );
}
