# Onboarding Flow Implementation

## Overview

This document describes the onboarding flow implementation for the Lead Attribution App. The system consists of multiple components that work together to guide new users through initial setup.

## Components Created

### 1. **OnboardingWizard.js**
A modal/overlay component that appears on first load to guide users through 4-step setup.

**Features:**
- Step 1: Business name input
- Step 2: Job types selection (Roof Repair, Estimate, Replacement, Other)
- Step 3: Twilio SMS integration (optional)
- Step 4: First lead creation
- Progress bar showing current step (1/4, 2/4, etc.)
- Skip button on every step
- Mobile-friendly overlay design
- Dark mode support
- Saves all progress to localStorage

**localStorage Keys Used:**
- `onboarding_progress`: Complete progress state (step, inputs, etc.)
- `businessName`: Business name entered in Step 1
- `selectedJobTypes`: Array of job types selected in Step 2
- `setupComplete`: Flag set when wizard completes
- `leads`: Array of leads (first lead created in Step 4)

**Usage:**
```jsx
<OnboardingWizard
  isOpen={showWizard}
  onComplete={handleWizardComplete}
  onSkip={handleWizardSkip}
/>
```

---

### 2. **OnboardingChecklist.js**
A persistent sidebar component showing setup progress in real-time.

**Features:**
- Always visible in bottom-right corner (floating panel)
- Shows 4 checklist items:
  - ✓ Business name set
  - ✓ Job types configured (shows count)
  - ✓ SMS webhook connected (marked as optional)
  - ✓ First lead added
- Auto-updates when checklist items complete
- Collapsible (minimize after setup complete)
- Floating button expands to full checklist
- Dark mode support
- Green checkmarks appear as items complete

**Checklist Items Auto-Update:**
1. Business name set → Watches `localStorage.businessName`
2. Job types configured → Watches `localStorage.selectedJobTypes`
3. SMS webhook connected → Watches `localStorage.twilioConnected`
4. First lead added → Watches `localStorage.leads`

**Usage:**
```jsx
<OnboardingChecklist isDarkMode={false} />
```

**How It Updates:**
- Listens to `storage` events (localStorage changes)
- Listens to custom `onboarding-update` events (dispatched by other components)

---

### 3. **Settings.js Updates**
Added "Integrate SMS Leads" section with step-by-step Twilio walkthrough.

**New Section: "Integrate SMS Leads (5 min setup)"**
- 4 expandable steps:
  1. Get Twilio Account → Link to twilio.com/console
  2. Copy Your Phone Number → Input field for Twilio number
  3. Set Webhook URL → Display webhook URL with copy button
  4. Test SMS → Instructions to test, button to mark complete

**Features:**
- Each step is expandable/collapsible
- "Copy URL" button for webhook
- "Mark Complete" button saves to localStorage
- Shows "✓ Connected" badge when complete
- Can reconfigure by clicking "Configure Again"
- Inline walkthrough (no external modal)

**localStorage Integration:**
- Sets `twilioConnected` flag when completed
- Dispatches `onboarding-update` event to notify checklist

**Webhook URL Format:**
```
{window.location.origin}/api/webhook/sms
```

---

### 4. **page.js Updates**
Wire up wizard and checklist to main app.

**Changes:**
1. Import `OnboardingWizard` and `OnboardingChecklist` components
2. Add state: `showWizard` (boolean)
3. On mount, check if setup is complete:
   - Show wizard if: `!setupComplete && !businessName && !leads`
   - Show checklist always
4. Pass handlers:
   - `onComplete` → closes wizard
   - `onSkip` → closes wizard

**Logic:**
```javascript
useEffect(() => {
  const setupComplete = localStorage.getItem('setupComplete');
  const businessName = localStorage.getItem('businessName');
  const leadsData = localStorage.getItem('leads');

  if (!setupComplete && !businessName && !leadsData) {
    setShowWizard(true);
  }
}, []);
```

---

### 5. **LeadQuickAdd.js Updates**
Triggers checklist update when leads are added.

**Changes:**
1. Both `handleQuickSubmit` and `handleDetailedSubmit` now dispatch custom event
2. Dispatches `onboarding-update` event after lead creation
3. Allows checklist to detect new leads and update

**Code:**
```javascript
// After lead is added
window.dispatchEvent(new Event('onboarding-update'));
```

---

## localStorage Keys Reference

| Key | Type | Purpose | Example |
|-----|------|---------|---------|
| `onboarding_progress` | JSON | Complete wizard state (survives page refresh) | `{currentStep: 2, businessName: "Smith Roofing", ...}` |
| `businessName` | string | User's business name | `"Smith Roofing Co."` |
| `selectedJobTypes` | JSON array | Chosen job types | `["Roof Repair", "Estimate"]` |
| `setupComplete` | boolean-like | Setup wizard completed | `"true"` |
| `twilioConnected` | boolean-like | Twilio integration enabled | `"true"` |
| `leads` | JSON array | All leads in system | `[{id: 123, name: "John", ...}]` |

---

## UX Flow

### First-Time User
1. User visits app → wizard appears
2. Step 1: Enter business name → saved to localStorage
3. Step 2: Select job types → saved to localStorage
4. Step 3: Connect Twilio (optional) → can skip or go to Settings
5. Step 4: Add first lead → saved to localStorage
6. Completion → localStorage `setupComplete` set, checklist auto-minimizes

### Returning User
- Checklist persists in bottom-right
- Shows current progress
- Can minimize when complete
- Can expand to see status again

### Settings Page
- Users can reconfigure Twilio at any time
- Can set business name / job types
- Checklist auto-updates when changes saved

---

## Integration Points

### When Job Types Are Saved (Settings.js)
- `handleAddJobType` → saves to localStorage
- Checklist watches `selectedJobTypes` and updates

### When Twilio Setup Completes (Settings.js)
- `handleMarkTwilioComplete` → saves `twilioConnected` flag
- Dispatches `onboarding-update` event
- Checklist updates checkbox

### When Lead Is Added (LeadQuickAdd.js)
- `handleQuickSubmit` or `handleDetailedSubmit`
- Dispatches `onboarding-update` event
- Checklist detects change and updates

---

## Styling & Theming

### Dark Mode Support
- All components support `dark:` Tailwind classes
- `OnboardingWizard`: Full dark mode with gradient header
- `OnboardingChecklist`: Dark mode in panel
- `Settings.js`: Dark mode in Twilio section

### Color Scheme
- **Primary**: Blue gradient (blue-600 → purple-600)
- **Success**: Green (green-500, green-600)
- **Warning**: Amber (amber-600)
- **Neutral**: Slate (slate-200 → slate-900)

### Mobile-Friendly
- `OnboardingWizard`: Modal with `max-w-md` + responsive padding
- `OnboardingChecklist`: Fixed positioning, adapts to mobile screens
- Forms: Full-width inputs with responsive spacing

---

## Error Handling

### Wizard Validation
- Step 1: Business name required
- Step 2: At least one job type required
- Step 4: Service and value required (numbers only)

### localStorage Recovery
- If localStorage is corrupted, components gracefully fall back to defaults
- Try-catch blocks wrap JSON.parse operations
- Missing data defaults to empty/false

---

## Testing Checklist

- [ ] First-time user sees wizard on page load
- [ ] Wizard Step 1 saves business name
- [ ] Wizard Step 2 saves job types (multi-select works)
- [ ] Wizard Step 3 can skip or go to Settings
- [ ] Wizard Step 4 can add lead or skip
- [ ] Pressing "Skip" on any step skips that step
- [ ] Pressing "Complete Setup" completes wizard
- [ ] OnboardingChecklist appears in bottom-right
- [ ] Checklist items check off as they complete
- [ ] Settings page shows Twilio section
- [ ] Twilio "Mark Complete" updates checklist
- [ ] Returning user does NOT see wizard (setupComplete set)
- [ ] Checklist can collapse/expand
- [ ] LeadQuickAdd updates checklist when lead added
- [ ] Dark mode works on all components
- [ ] Mobile view is readable (wizard is modal)

---

## Future Enhancements

1. **Analytics**: Track which users complete setup vs abandon
2. **Reminders**: Send email if setup incomplete after 24h
3. **Help Tooltips**: Add hover tooltips to confusing fields
4. **Video Guide**: Embed Twilio setup video in Step 3
5. **Onboarding Emails**: Send post-signup emails with setup links
6. **Feature Flags**: Hide advanced features behind onboarding completion
7. **Wizard Skip Limit**: Show simplified wizard if user skips initial wizard
8. **Contextual Help**: Show help panel when user is stuck

---

## Deployment Notes

### Before Production
1. Test localStorage quota (5-10MB typical)
2. Verify webhook URL is correct in Step 3
3. Test on mobile devices
4. Test with dark mode enabled
5. Verify Twilio links are not outdated

### localStorage Persistence
- Persists across browser refresh
- Clears only if user clears browser data
- Consider implementing sessionStorage for first-load-only data

### Performance
- Minimal re-renders (only on storage changes)
- No external API calls during setup
- All data stored locally until completion

---

## Code Files Modified/Created

### Created:
- `app/components/OnboardingWizard.js` (13.6 KB)
- `app/components/OnboardingChecklist.js` (9.8 KB)
- `ONBOARDING_IMPLEMENTATION.md` (this file)

### Modified:
- `app/page.js` - Added wizard & checklist imports + logic
- `app/components/Settings.js` - Added Twilio integration section
- `app/components/LeadQuickAdd.js` - Added onboarding-update event dispatch

---

## Commit Message

```
feat: add onboarding wizard and setup checklist for first-time users

- OnboardingWizard.js: 4-step modal (business name, job types, Twilio, first lead)
- OnboardingChecklist.js: Floating checklist in bottom-right with real-time updates
- Settings.js: Added Twilio integration step-by-step walkthrough
- page.js: Integrated wizard trigger and checklist display
- LeadQuickAdd.js: Dispatches events to update checklist on lead creation
- localStorage keys documented and used throughout
- Mobile-friendly and dark mode support
- Skip-able at any point, saves progress on page refresh

DELIVERABLES COMPLETED:
✓ OnboardingWizard.js (4 steps, progress bar, skip buttons)
✓ OnboardingChecklist.js (real-time updates, collapsible)
✓ Settings.js Twilio walkthrough (5 min setup guide)
✓ page.js integration (first-load detection, wizard trigger)
✓ LeadQuickAdd.js events (checklist auto-update)
```

---

**Implementation Date:** March 16, 2026
**Version:** 1.0.0
**Status:** ✅ Complete
