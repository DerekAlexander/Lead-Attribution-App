'use client';

import { useState } from 'react';

// Fuzzy match helper - finds closest match by string similarity
function fuzzyMatch(input, options, threshold = 0.6) {
  const input_lower = input.toLowerCase().trim();
  
  let bestMatch = null;
  let bestScore = threshold;

  options.forEach((option) => {
    const option_lower = option.toLowerCase();
    
    // Exact substring match gets highest priority
    if (option_lower.includes(input_lower)) {
      bestScore = 1.0;
      bestMatch = option;
      return;
    }

    // Levenshtein distance for fuzzy matching
    const score = calculateSimilarity(input_lower, option_lower);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = option;
    }
  });

  return bestMatch;
}

// Calculate similarity score (0-1) based on Levenshtein distance
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Calculate Levenshtein distance
function getEditDistance(s1, s2) {
  const costs = [];
  for (let k = 0; k <= s1.length; k++) {
    let lastValue = k;
    for (let i = 0; i <= s2.length; i++) {
      if (k === 0) {
        costs[i] = i;
      } else if (i > 0) {
        let newValue = costs[i - 1];
        if (s1.charAt(k - 1) !== s2.charAt(i - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[i]) + 1;
        }
        costs[i - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (k > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export default function CompletionParser({ leads, onLeadCompleted }) {
  const [parseText, setParseText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [matchedLead, setMatchedLead] = useState(null);

  const handleParse = (e) => {
    e.preventDefault();
    setFeedback('');
    setMatchedLead(null);

    if (!parseText.trim()) {
      setFeedback('❌ Enter a completion message (e.g., "rawrbot completed")');
      return;
    }

    // Extract the name/identifier from the input
    // Common patterns:
    // - "rawrbot completed"
    // - "rawrbot done"
    // - "rawrbot finished"
    // - "completed rawrbot"
    // - "done: rawrbot"
    
    const completionKeywords = ['completed', 'done', 'finished', 'close', 'closed'];
    const input_lower = parseText.toLowerCase();
    
    let leadIdentifier = parseText;

    // Try to extract name by removing completion keywords
    completionKeywords.forEach((keyword) => {
      if (input_lower.includes(keyword)) {
        leadIdentifier = parseText
          .replace(new RegExp(keyword, 'i'), '')
          .replace(/[:\-\s]+/g, ' ')
          .trim();
      }
    });

    if (!leadIdentifier) {
      setFeedback('❌ Could not extract lead name from input');
      return;
    }

    // Get all lead names
    const leadNames = leads.map((l) => l.name);
    
    // Find fuzzy match
    const matched = fuzzyMatch(leadIdentifier, leadNames, 0.5);

    if (!matched) {
      setFeedback(
        `❌ No lead found matching "${leadIdentifier}". Available: ${leadNames.join(', ')}`
      );
      return;
    }

    // Find the full lead object
    const leadToComplete = leads.find((l) => l.name === matched);

    if (leadToComplete.status === 'converted') {
      setFeedback(`⚠️ "${matched}" is already marked as Converted`);
      setMatchedLead(leadToComplete);
      return;
    }

    // Mark as completed
    onLeadCompleted(leadToComplete.id);
    setFeedback(`✅ Lead completed: "${matched}" → Converted`);
    setMatchedLead(leadToComplete);
    setParseText('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg shadow p-6 mb-6 border border-blue-200 dark:border-blue-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        📱 Mark Lead Completed
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Text format: <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">"name completed"</code> (e.g., "rawrbot completed", "john finished")
      </p>

      <form onSubmit={handleParse} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={parseText}
            onChange={(e) => setParseText(e.target.value)}
            placeholder="e.g., rawrbot completed"
            className="flex-1 px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Parse
          </button>
        </div>

        {feedback && (
          <div
            className={`text-sm p-3 rounded ${
              feedback.includes('✅')
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                : feedback.includes('⚠️')
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
            }`}
          >
            {feedback}
          </div>
        )}

        {matchedLead && (
          <div className="bg-white dark:bg-slate-800 rounded p-3 border border-blue-300 dark:border-blue-600">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Matched Lead: <strong>{matchedLead.name}</strong>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {matchedLead.notes} • ${matchedLead.value || '—'}
            </p>
          </div>
        )}
      </form>

      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-600">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          💡 <strong>Fuzzy matching:</strong> Finds the closest lead name match. Typos like "rabot" or "rawbot" will still work!
        </p>
      </div>
    </div>
  );
}
