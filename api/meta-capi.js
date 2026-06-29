export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const pixelId = '311413340280663';
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!accessToken) return res.status(200).json({ ok: false, reason: 'META_CAPI_TOKEN not configured' });

  try {
    const { eventName, customData = {} } = req.body || {};
    if (!eventName) return res.status(400).json({ error: 'eventName is required' });

    const eventSourceUrl = req.headers.referer || `https://${req.headers.host || ''}`;
    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: {
          client_ip_address: req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress,
          client_user_agent: req.headers['user-agent']
        },
        custom_data: customData
      }]
    };

    const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json({ ok: response.ok, data });
  } catch (error) {
    return res.status(200).json({ ok: false, error: String(error) });
  }
}
