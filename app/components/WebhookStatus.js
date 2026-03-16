'use client';

import { useState, useEffect } from 'react';

export default function WebhookStatus() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Build webhook URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/api/webhook/sms`;
    setWebhookUrl(url);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestWebhook = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/webhook/sms', {
        method: 'GET',
      });
      const data = await response.json();
      setTestResult({ status: 'success', data });
    } catch (error) {
      setTestResult({ status: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        📱 SMS Webhook Configuration
      </h3>

      <div className="space-y-4">
        {/* Webhook URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Webhook URL (for Twilio)
          </label>
          <div className="flex gap-2">
            <code className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-mono text-sm break-all">
              {webhookUrl}
            </code>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {copied ? '✅ Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Paste this into Twilio → Phone Numbers → Webhooks (Incoming Messages)
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🚀 Setup Instructions</h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Get a Twilio account & phone number</li>
            <li>Set env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER</li>
            <li>In Twilio console, go to Phone Numbers</li>
            <li>Select your number, scroll to "Messaging"</li>
            <li>Set "A MESSAGE COMES IN" webhook to the URL above</li>
            <li>Method: HTTP POST</li>
            <li>Save & test by texting your Twilio number</li>
          </ol>
        </div>

        {/* Environment Variables */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Required Environment Variables
          </label>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1">
            <p>TWILIO_ACCOUNT_SID=your_account_sid</p>
            <p>TWILIO_AUTH_TOKEN=your_auth_token</p>
            <p>TWILIO_PHONE_NUMBER=+1234567890</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            For local dev: create <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">.env.local</code> in project root
          </p>
        </div>

        {/* Test Webhook */}
        <div>
          <button
            onClick={handleTestWebhook}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Testing...' : 'Test Webhook'}
          </button>
          {testResult && (
            <div
              className={`mt-3 p-3 rounded text-sm ${
                testResult.status === 'success'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
              }`}
            >
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(testResult.data || testResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Message Formats */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">📨 Supported SMS Formats</h4>
          <div className="space-y-2 text-sm">
            <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
              <p className="font-medium text-slate-900 dark:text-white">New Lead</p>
              <p className="text-slate-600 dark:text-slate-400">roof repair 6500</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Service name + value</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
              <p className="font-medium text-slate-900 dark:text-white">Mark Complete</p>
              <p className="text-slate-600 dark:text-slate-400">rawrbot completed</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Lead name + completion keyword</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
