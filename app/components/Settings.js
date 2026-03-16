'use client';

import { useState, useEffect } from 'react';
import WebhookStatus from './WebhookStatus';

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
  const [twilioStep, setTwilioStep] = useState(0);
  const [twilioConnected, setTwilioConnected] = useState(false);

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
    
    const connected = localStorage.getItem('twilioConnected');
    setTwilioConnected(!!connected);
    
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

  const handleMarkTwilioComplete = () => {
    localStorage.setItem('twilioConnected', 'true');
    setTwilioConnected(true);
    setTwilioStep(0);
    setFeedback('✅ Twilio integration marked as complete!');
    setTimeout(() => setFeedback(''), 3000);
    
    // Notify other components
    window.dispatchEvent(new Event('onboarding-update'));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Webhook Status */}
      <WebhookStatus />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">⚙️ Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Customize your lead tracking system. Define job types and manage statuses.
        </p>
      </div>

      {/* Twilio Integration Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              📱 Integrate SMS Leads
              {twilioConnected && (
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full">
                  ✓ Connected
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Receive leads directly via SMS. Set up takes about 5 minutes.
            </p>
          </div>
        </div>

        {!twilioConnected ? (
          <div className="space-y-4">
            {/* Step-by-step guide */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>⚡ Quick Setup:</strong> Follow these steps to enable SMS lead capture.
              </p>
            </div>

            {/* Step 1 */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                twilioStep === 1
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
              onClick={() => setTwilioStep(twilioStep === 1 ? 0 : 1)}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Get Twilio Account</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Sign up or log into your Twilio account.
                  </p>
                  {twilioStep === 1 && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                        👉 Visit{' '}
                        <a
                          href="https://www.twilio.com/console"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          twilio.com/console
                        </a>
                      </p>
                      <button
                        onClick={() => setTwilioStep(2)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors text-sm"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                twilioStep === 2
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
              onClick={() => setTwilioStep(twilioStep === 2 ? 0 : 2)}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Copy Your Phone Number</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Get your Twilio phone number from the Console.
                  </p>
                  {twilioStep === 2 && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        Your Twilio phone number will be used to receive SMS leads.
                      </p>
                      <input
                        type="text"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 text-sm mb-3"
                      />
                      <button
                        onClick={() => setTwilioStep(3)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors text-sm"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                twilioStep === 3
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
              onClick={() => setTwilioStep(twilioStep === 3 ? 0 : 3)}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Set Webhook URL</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Paste the webhook URL into Twilio's SMS settings.
                  </p>
                  {twilioStep === 3 && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        In Twilio Console, go to Phone Numbers → Active Numbers → Your Number → Messaging.
                      </p>
                      <p className="text-sm font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded mb-3 text-slate-900 dark:text-white">
                        {typeof window !== 'undefined'
                          ? `${window.location.origin}/api/webhook/sms`
                          : '/api/webhook/sms'}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/sms`
                          );
                          alert('Webhook URL copied to clipboard!');
                        }}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded transition-colors text-sm mr-2"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => setTwilioStep(4)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors text-sm"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                twilioStep === 4
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
              onClick={() => setTwilioStep(twilioStep === 4 ? 0 : 4)}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Test SMS</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Send a test message to verify it works.
                  </p>
                  {twilioStep === 4 && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                        Send a test SMS to your Twilio number in the format: "roof repair 5000"
                      </p>
                      <button
                        onClick={handleMarkTwilioComplete}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors text-sm"
                      >
                        ✓ Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Setup Complete</h3>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Your Twilio integration is active. You can now receive SMS leads!
                </p>
                <button
                  onClick={() => setTwilioConnected(false)}
                  className="text-sm text-green-700 dark:text-green-300 hover:underline mt-2 font-medium"
                >
                  Configure Again
                </button>
              </div>
            </div>
          </div>
        )}
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
