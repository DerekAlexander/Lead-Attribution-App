'use client';

import { useState } from 'react';
import LeadQuickAdd from './LeadQuickAdd';
import CompletionParser from './CompletionParser';

export default function LeadsBreakdown() {
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      source: 'Organic Search',
      date: '2026-03-16',
      status: 'converted',
      value: 450,
      notes: 'Roof inspection inquiry',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 234-5678',
      source: 'Google Local',
      date: '2026-03-16',
      status: 'converted',
      value: 350,
      notes: 'Quote requested',
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '(555) 345-6789',
      source: 'Organic Search',
      date: '2026-03-15',
      status: 'qualified',
      value: null,
      notes: 'Interested, awaiting callback',
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa@example.com',
      phone: '(555) 456-7890',
      source: 'Direct',
      date: '2026-03-15',
      status: 'contacted',
      value: null,
      notes: 'Initial contact made',
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert@example.com',
      phone: '(555) 567-8901',
      source: 'Google Local',
      date: '2026-03-14',
      status: 'converted',
      value: 550,
      notes: 'Full roof replacement',
    },
    {
      id: 6,
      name: 'Emma Martinez',
      email: 'emma@example.com',
      phone: '(555) 678-9012',
      source: 'Organic Search',
      date: '2026-03-14',
      status: 'qualified',
      value: null,
      notes: 'Emergency repair needed',
    },
    {
      id: 7,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '(555) 789-0123',
      source: 'Direct',
      date: '2026-03-13',
      status: 'contacted',
      value: null,
      notes: 'Waiting for estimate',
    },
    {
      id: 8,
      name: 'Jessica Lee',
      email: 'jessica@example.com',
      phone: '(555) 890-1234',
      source: 'Google Local',
      date: '2026-03-13',
      status: 'converted',
      value: 420,
      notes: 'Gutter cleaning + inspection',
    },
  ]);

  const handleLeadAdded = (newLead) => {
    setLeads([newLead, ...leads]);
  };

  const handleLeadCompleted = (leadId) => {
    setLeads(
      leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: 'converted', value: lead.value || 0 }
          : lead
      )
    );
  };

  // Filter and sort
  let filtered = leads.filter((lead) => {
    if (filterSource !== 'all' && lead.source !== filterSource) return false;
    if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
    return true;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'value-high') return (b.value || 0) - (a.value || 0);
    if (sortBy === 'value-low') return (a.value || 0) - (b.value || 0);
    return 0;
  });

  const totalValue = filtered
    .filter((lead) => lead.status === 'converted')
    .reduce((sum, lead) => sum + (lead.value || 0), 0);

  const stats = {
    converted: filtered.filter((l) => l.status === 'converted').length,
    qualified: filtered.filter((l) => l.status === 'qualified').length,
    contacted: filtered.filter((l) => l.status === 'contacted').length,
  };

  const statusColors = {
    converted: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    qualified: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    contacted: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
  };

  const statusLabels = {
    converted: '✅ Converted',
    qualified: '🔥 Qualified',
    contacted: '📞 Contacted',
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Form */}
      <LeadQuickAdd onLeadAdded={handleLeadAdded} />

      {/* Completion Parser */}
      <CompletionParser leads={leads} onLeadCompleted={handleLeadCompleted} />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">Converted</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.converted}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Sales closed</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">Qualified</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.qualified}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Ready to close</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">Contacted</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.contacted}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">In progress</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Value</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalValue}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Converted value</p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Source
            </label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">All Sources</option>
              <option value="Organic Search">Organic Search</option>
              <option value="Google Local">Google Local</option>
              <option value="Direct">Direct</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="converted">Converted</option>
              <option value="qualified">Qualified</option>
              <option value="contacted">Contacted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="value-high">Highest Value</option>
              <option value="value-low">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {lead.notes}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-slate-900 dark:text-white">{lead.email}</p>
                        <p className="text-slate-600 dark:text-slate-400">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{lead.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[lead.status]
                        }`}
                      >
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {lead.value ? `$${lead.value}` : '—'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-slate-600 dark:text-slate-400"
                  >
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        <p>Showing {filtered.length} of {leads.length} leads</p>
        <p className="mt-1">Real data will sync from Google Analytics 4 once connected</p>
      </div>
    </div>
  );
}
