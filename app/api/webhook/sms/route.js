import { Twilio } from 'twilio';

// Initialize Twilio client - uses env vars
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilio = null;
if (accountSid && authToken) {
  twilio = new Twilio(accountSid, authToken);
}

// Fuzzy match helper - same as in frontend
function fuzzyMatch(input, options, threshold = 0.6) {
  const input_lower = input.toLowerCase().trim();

  let bestMatch = null;
  let bestScore = threshold;

  options.forEach((option) => {
    const option_lower = option.toLowerCase();

    if (option_lower.includes(input_lower)) {
      bestScore = 1.0;
      bestMatch = option;
      return;
    }

    const score = calculateSimilarity(input_lower, option_lower);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = option;
    }
  });

  return bestMatch;
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

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

async function sendSmsResponse(toNumber, message) {
  if (!twilio) {
    console.warn('Twilio not configured, skipping SMS response');
    return;
  }

  try {
    await twilio.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: toNumber,
    });
  } catch (error) {
    console.error('Failed to send SMS response:', error);
  }
}

export async function POST(request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const fromNumber = params.get('From');
    const messageBody = params.get('Body');

    console.log(`[SMS Webhook] From: ${fromNumber}, Message: ${messageBody}`);

    if (!messageBody) {
      return new Response('No message body', { status: 400 });
    }

    // Parse the message
    const completionKeywords = ['completed', 'done', 'finished', 'close', 'closed'];
    const messageBodyLower = messageBody.toLowerCase();

    let leadIdentifier = messageBody;
    let isCompletion = false;

    // Check if this is a completion message
    completionKeywords.forEach((keyword) => {
      if (messageBodyLower.includes(keyword)) {
        isCompletion = true;
        leadIdentifier = messageBody
          .replace(new RegExp(keyword, 'i'), '')
          .replace(/[:\-\s]+/g, ' ')
          .trim();
      }
    });

    // Format: "name value" for new leads, "name completed" for completions
    const isNewLead = !isCompletion && /\d+$/.test(messageBody);

    let response = {
      type: isNewLead ? 'new_lead' : isCompletion ? 'completion' : 'unknown',
      raw: messageBody,
      leadIdentifier: leadIdentifier,
      phoneNumber: fromNumber,
      timestamp: new Date().toISOString(),
    };

    // Send acknowledgment SMS
    let smsResponse = `Got it! `;
    if (isNewLead) {
      smsResponse += `Lead received: ${leadIdentifier}`;
    } else if (isCompletion) {
      smsResponse += `Marking "${leadIdentifier}" as completed.`;
    } else {
      smsResponse += `Received: ${messageBody}`;
    }

    await sendSmsResponse(fromNumber, smsResponse);

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error('SMS webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  return Response.json({
    status: 'SMS webhook ready',
    configured: !!twilio,
    expectedFormat: {
      newLead: 'roof repair 6500',
      completion: 'rawrbot completed',
    },
  });
}
