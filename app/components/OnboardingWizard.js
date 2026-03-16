'use client';

import { useState, useEffect } from 'react';

const JOB_TYPES_OPTIONS = ['Roof Repair', 'Estimate', 'Replacement', 'Other'];

export default function OnboardingWizard({ isOpen, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [skipTwilio, setSkipTwilio] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    value: '',
  });
  const [errors, setErrors] = useState({});

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onboarding_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentStep(data.currentStep || 1);
        setBusinessName(data.businessName || '');
        setSelectedJobTypes(data.selectedJobTypes || []);
        setSkipTwilio(data.skipTwilio || false);
        setLeadData(data.leadData || leadData);
      } catch (e) {
        console.error('Failed to load onboarding progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      currentStep,
      businessName,
      selectedJobTypes,
      skipTwilio,
      leadData,
    };
    localStorage.setItem('onboarding_progress', JSON.stringify(progress));
  }, [currentStep, businessName, selectedJobTypes, skipTwilio, leadData]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
    } else if (step === 2) {
      if (selectedJobTypes.length === 0) {
        newErrors.jobTypes = 'Select at least one job type';
      }
    } else if (step === 4) {
      if (!leadData.service.trim()) {
        newErrors.service = 'Service is required';
      }
      if (!leadData.value || parseInt(leadData.value) <= 0) {
        newErrors.value = 'Valid value is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && skipTwilio) {
        // Skip Twilio, go to step 4
        setCurrentStep(4);
      } else if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleSkipStep = () => {
    if (currentStep === 3) {
      setSkipTwilio(true);
      setCurrentStep(4);
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Save to localStorage
    localStorage.setItem('businessName', businessName);
    localStorage.setItem('selectedJobTypes', JSON.stringify(selectedJobTypes));
    localStorage.setItem('setupComplete', 'true');

    // Create lead if data provided
    if (leadData.service && leadData.value) {
      const newLead = {
        id: Date.now(),
        name: leadData.name || 'First Lead',
        email: leadData.email || 'pending@example.com',
        phone: leadData.phone || '(pending)',
        source: 'Direct',
        date: new Date().toISOString().split('T')[0],
        status: 'contacted',
        value: parseInt(leadData.value),
        notes: leadData.service,
      };
      
      // Add to leads
      const existingLeads = localStorage.getItem('leads');
      const leads = existingLeads ? JSON.parse(existingLeads) : [];
      leads.push(newLead);
      localStorage.setItem('leads', JSON.stringify(leads));
    }

    // Clear progress
    localStorage.removeItem('onboarding_progress');

    if (onComplete) {
      onComplete();
    }
  };

  const handleJobTypeToggle = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const progressPercent = (currentStep / 4) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-white">Welcome to Lead Attribution!</h1>
            <button
              onClick={onSkip}
              className="text-white text-sm opacity-75 hover:opacity-100 font-medium"
            >
              ✕
            </button>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-white text-xs mt-2">Step {currentStep} of 4</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Business Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                What's your business name?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                This helps personalize your dashboard and reports.
              </p>
              <input
                type="text"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  setErrors({});
                }}
                placeholder="e.g., Smith Roofing Co."
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.businessName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                }`}
                autoFocus
              />
              {errors.businessName && (
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.businessName}</p>
              )}
            </div>
          )}

          {/* Step 2: Job Types */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                What job types do you track?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Select the types of jobs you handle.
              </p>
              <div className="space-y-3">
                {JOB_TYPES_OPTIONS.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => {
                        handleJobTypeToggle(type);
                        setErrors({});
                      }}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-900 dark:text-white">{type}</span>
                  </label>
                ))}
              </div>
              {errors.jobTypes && (
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.jobTypes}</p>
              )}
            </div>
          )}

          {/* Step 3: Twilio Setup */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Connect Twilio for SMS Leads?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Receive leads via SMS. Takes about 5 minutes to set up.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  📱 You'll be able to send leads directly via text message once connected.
                </p>
              </div>
              <button
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                onClick={() => {
                  // Navigate to settings (this would need router integration)
                  window.location.hash = '#settings';
                }}
              >
                Go to Settings to Connect Twilio
              </button>
              <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                Or skip for now and set it up later.
              </p>
            </div>
          )}

          {/* Step 4: Add First Lead */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Add your first lead
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Let's create your first lead entry.
              </p>

              <input
                type="text"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="Lead name (optional)"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />

              <input
                type="tel"
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                placeholder="Phone (optional)"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />

              <input
                type="email"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                placeholder="Email (optional)"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                value={leadData.service}
                onChange={(e) => {
                  setLeadData({ ...leadData, service: e.target.value });
                  setErrors({});
                }}
                placeholder="Service type *"
                className={`w-full px-4 py-2 border-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.service ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                }`}
              />
              {errors.service && (
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.service}</p>
              )}

              <input
                type="number"
                value={leadData.value}
                onChange={(e) => {
                  setLeadData({ ...leadData, value: e.target.value });
                  setErrors({});
                }}
                placeholder="Lead value *"
                className={`w-full px-4 py-2 border-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.value ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                }`}
              />
              {errors.value && (
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.value}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-3 bg-slate-50 dark:bg-slate-700/50">
          <button
            onClick={handleNextStep}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {currentStep === 4 ? 'Complete Setup' : 'Next'}
          </button>
          <button
            onClick={handleSkipStep}
            className="w-full px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {currentStep === 4 ? 'Skip for Now' : 'Skip This Step'}
          </button>
        </div>
      </div>
    </div>
  );
}
