export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: false, message: 'Method not allowed' });
    return;
  }

  const secret = process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY_TEST;
  if (!secret) {
    res.status(500).json({ status: false, message: 'Server missing PAYSTACK_SECRET_KEY' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  try {
    const apiRes = await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message || 'Paystack error' });
  }
}
