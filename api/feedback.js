const MAX_TEXT_LENGTH = 6000;
const MAX_SCREENSHOT_BYTES = 4 * 1024 * 1024;

function clean(value, limit = MAX_TEXT_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

module.exports = async function feedback(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  if (clean(body.website, 200)) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  const category = clean(body.category, 80) || 'Other';
  const description = clean(body.description);
  const expected = clean(body.expected, 3000);
  const contactEmail = clean(body.email, 200);
  const screenshot = body.screenshot && typeof body.screenshot === 'object' ? body.screenshot : null;

  if (!description) {
    return res.status(400).json({ error: 'Please describe the feedback.' });
  }
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (screenshot && (!screenshot.data || typeof screenshot.data !== 'string' || screenshot.data.length > MAX_SCREENSHOT_BYTES * 1.4)) {
    return res.status(413).json({ error: 'That image is too large. Please choose a smaller screenshot.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.FEEDBACK_TO_EMAIL;
  if (!apiKey || !recipient) {
    console.error('Feedback email is not configured. Set RESEND_API_KEY and FEEDBACK_TO_EMAIL.');
    return res.status(503).json({ error: 'Feedback email is not configured yet.' });
  }

  const lines = [
    `Category: ${category}`,
    `Page: ${clean(body.page, 500) || 'Unknown'}`,
    `App date: ${clean(body.appDate, 40) || 'Unknown'}`,
    '',
    'What the user reported:',
    description,
    '',
    'What they expected (optional):',
    expected || 'Not provided',
    '',
    `Reply email: ${contactEmail || 'Not provided'}`
  ];

  const email = {
    from: process.env.FEEDBACK_FROM_EMAIL || 'Fit Logs Feedback <onboarding@resend.dev>',
    to: [recipient],
    subject: `[Fit Logs] ${category}`,
    text: lines.join('\n'),
    ...(contactEmail ? { reply_to: contactEmail } : {})
  };

  if (screenshot && screenshot.data) {
    email.attachments = [{
      filename: clean(screenshot.name, 120) || 'feedback-screenshot.png',
      content: screenshot.data
    }];
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Resend rejected feedback email:', result);
      return res.status(502).json({ error: 'The feedback email could not be sent.' });
    }
    return res.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    console.error('Feedback email request failed:', error);
    return res.status(502).json({ error: 'The feedback email could not be sent.' });
  }
};
