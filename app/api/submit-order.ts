export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyQR4SAOM-GGQYjcjJ7mfahvsrBQeHH9VfMEfGAI07gLR6zLpgRez31QM9hwVyvd0M/exec";

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(200).send(text);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy failed');
  }
}
