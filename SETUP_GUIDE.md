# Lead Attribution App - Setup Guide

## Quick Start (Local Testing)

### 1. Get the App Running
```bash
git clone https://github.com/DerekAlexander/Lead-Attribution-App.git
cd Lead-Attribution-App
npm install
npm run dev
```
Visit: http://localhost:3001

### 2. Configure Custom Job Types
1. Go to **⚙️ Settings** tab
2. Add your job types (Roof Repair, Roof Estimate, Roof Replacement, etc.)
3. These will appear in your lead form dropdowns

### 3. Add Leads
Two ways:
- **Quick SMS-style:** "roof repair 6500"
- **Full Form:** Name, Phone, Email, Job Type, Value, Status, Source

### 4. Mark Leads Complete
Text format: **"name completed"**
- "john smith completed"
- "rawrbot finished"
- Fuzzy matches work (typos OK!)

---

## Twilio SMS Setup (Production)

### Get Twilio Credentials
1. Sign up at https://www.twilio.com/
2. Get a phone number (or use existing)
3. Go to **Console** → find your **Account SID** and **Auth Token**

### Configure Environment Variables
Create `.env.local` in project root:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

### Configure Twilio Webhook
1. In Twilio Console: Phone Numbers → Manage
2. Select your phone number
3. Scroll to **Messaging** section
4. Set **"A MESSAGE COMES IN"** webhook:
   - URL: `https://your-app-url.com/api/webhook/sms` (replace with your domain)
   - Method: **HTTP POST**
5. Save

### Test It
1. Go to Settings → "Test Webhook" button
2. Should show "SMS webhook ready" + supported formats
3. Text your Twilio number: "roof repair 6500"
4. Should get SMS response back

---

## Workflow (Alexander's Roofing Example)

### Day 1: Lead Comes In
**Source:** Google Local (GA4 will auto-track once connected)
**Option A - Web Form:**
- Name: John Smith
- Job Type: Roof Repair (from dropdown)
- Value: $6,500

**Option B - Text SMS:**
- Send: "roof repair 6500"
- App creates lead automatically

### Day 2: Follow Up
**Status Update:**
- Click lead row, change status to "Awaiting Callback"

### Day 5: Job Complete
**Text to mark done:**
- Send: "john completed"
- App marks as **Converted** + updates stats

### Result
Dashboard shows:
- ✅ Converted: 1 lead
- 💰 Value: $6,500
- 📊 ROI tracked

---

## Data Storage

### Current (Frontend Only)
- Uses **browser localStorage**
- Data survives page refresh
- All data stays on your device

### Next Phase (Optional)
- Connect to database (Supabase/Firebase)
- Sync across devices
- Mobile app

---

## SMS Message Formats

| Action | Format | Example |
|--------|--------|---------|
| **New Lead** | service_name value | roof repair 6500 |
| **Mark Complete** | name + keyword | john completed |
| | | rawrbot finished |
| | | jessica done |

---

## Troubleshooting

### SMS Not Working?
- [ ] Check TWILIO env vars are set
- [ ] Restart dev server (`npm run dev`)
- [ ] Verify Twilio webhook URL is correct in console
- [ ] Try "Test Webhook" button in Settings

### Webhook URL Wrong?
- Local: http://localhost:3001/api/webhook/sms (won't work with Twilio!)
- Production: https://your-domain.com/api/webhook/sms

### Leads Not Appearing?
- Check localStorage is enabled in browser
- Refresh page
- Check browser console for errors (F12 → Console)

---

## Deployment (Vercel Recommended)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Connect to Vercel
- Go to https://vercel.com
- Import this GitHub repo
- Set environment variables (Settings → Environment Variables):
  - TWILIO_ACCOUNT_SID
  - TWILIO_AUTH_TOKEN
  - TWILIO_PHONE_NUMBER

### 3. Deploy
- Vercel auto-deploys on git push

### 4. Update Twilio Webhook
- URL: https://your-vercel-domain.vercel.app/api/webhook/sms

---

## Features Implemented

✅ Custom job types (configurable)
✅ Lead entry (web form + SMS)
✅ Status tracking (default statuses)
✅ SMS completion parser (fuzzy matching)
✅ Real-time dashboard
✅ Data persistence (localStorage)
✅ Twilio SMS webhook
✅ Responsive design (mobile + dark mode)

## Coming Soon

🔲 GA4 integration (auto-track lead sources)
🔲 Thryv CRM sync (pull deal values)
🔲 Database backend (multi-device sync)
🔲 Reports + analytics
🔲 Mobile app

---

## Support

For questions or issues, reach out!
