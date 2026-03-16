'use client';

import { useState, useEffect } from 'react';

export default function LeadQuickAdd({ onLeadAdded }) {
  const [inputMode, setInputMode] = useState('quick'); // 'quick' or 'detailed'
  const [quickText, setQuickText] = useState('');
  const [customJobTypes, setCustomJobTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    status: 'New Lead',
    value: '',
    source: 'Direct',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Load custom job types from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customJobTypes');
    if (saved) {
      try {
        setCustomJobTypes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load job types:', e);
      }
    }
  }, []);

  const parseQuickInput = (text) => {
    // Parse formats like:
    // "roof repair 6500"
    // "roof inspection $1200"
    // "gutter cleaning 450"
    const match = text.match(/^(.+?)\s+[\$]?(\d+)$/i);
    if (match) {
      return {
        service: match[1].trim(),
        value: parseInt(match[2]),
      };
    }
    return null;
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    setFeedback('');

    const parsed = parseQuickInput(quickText);
    if (!parsed) {
      setFeedback('❌ Format: "service name VALUE" (e.g., "roof repair 6500")');
      return;
    }

    const newLead = {
      id: Date.now(),
      name: 'New Lead',
      email: 'pending@example.com',
      phone: '(pending)',
      source: 'Direct',
      date: new Date().toISOString().split('T')[0],
      status: 'contacted',
      value: parsed.value,
      notes: parsed.service,
    };

    onLeadAdded(newLead);
    setFeedback(`✅ Lead added: ${parsed.service} - $${parsed.value}`);
    setQuickText('');
    
    // Notify checklist that a lead was added
    window.dispatchEvent(new Event('onboarding-update'));
    
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDetailedSubmit = (e) => {
    e.preventDefault();
    setFeedback('');

    if (!formData.service || !formData.value) {
      setFeedback('❌ Service and value required');
      return;
    }

    // Map status to old convention for backward compat
    const statusMap = {
      'New Lead': 'contacted',
      'Interested': 'contacted',
      'Awaiting Callback': 'contacted',
      'Waiting for Estimate': 'qualified',
    };

    const newLead = {
      id: Date.now(),
      name: formData.name || 'New Lead',
      email: formData.email || 'pending@example.com',
      phone: formData.phone || '(pending)',
      source: formData.source || 'Direct',
      date: new Date().toISOString().split('T')[0],
      status: statusMap[formData.status] || 'contacted',
      value: parseInt(formData.value),
      notes: formData.service,
    };

    onLeadAdded(newLead);
    setFeedback(`✅ Lead added: ${formData.name || 'New Lead'}`);
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      status: 'New Lead',
      value: '',
      source: 'Direct',
    });
    
    // Notify checklist that a lead was added
    window.dispatchEvent(new Event('onboarding-update'));
    
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">➕ Quick Add Lead</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setInputMode('quick')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              inputMode === 'quick'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
            }`}
          >
            SMS-Style
          </button>
          <button
            onClick={() => setInputMode('detailed')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              inputMode === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
            }`}
          >
            Full Form
          </button>
        </div>
      </div>

      {inputMode === 'quick' ? (
        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Service & Value
            </label>
            <input
              type="text"
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              placeholder="e.g., roof repair 6500"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Format: "service name VALUE" (works with SMS too!)
            </p>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Lead
          </button>
          {feedback && (
            <div className="text-sm text-center p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              {feedback}
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleDetailedSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Type *
              </label>
              {customJobTypes.length > 0 ? (
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="">Select a job type...</option>
                  {customJobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Roof repair"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              )}
              {customJobTypes.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  💡 Go to Settings to add custom job types
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Value ($) *
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="6500"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option>New Lead</option>
              <option>Interested</option>
              <option>Awaiting Callback</option>
              <option>Waiting for Estimate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option>Direct</option>
              <option>Organic Search</option>
              <option>Google Local</option>
              <option>Phone Call</option>
              <option>Referral</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Lead
          </button>
          {feedback && (
            <div className="text-sm text-center p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              {feedback}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
