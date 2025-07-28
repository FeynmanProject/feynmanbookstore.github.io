export default async function handler(req: any, res: any) {
  try {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyQR4SAOM-GGQYjcjJ7mfahvsrBQeHH9VfMEfGAI07gLR6zLpgRez31QM9hwVyvd0M/exec";
    const query = req.url?.split('?')[1] || '';
    const response = await fetch(`${scriptUrl}?${query}`, { method: 'GET' });
    const text = await response.text();
    res.status(200).send(text);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy failed');
  }
}
