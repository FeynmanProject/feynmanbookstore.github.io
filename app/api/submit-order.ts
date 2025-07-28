export async function GET(req: Request) {
  try {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyQR4SAOM-GGQYjcjJ7mfahvsrBQeHH9VfMEfGAI07gLR6zLpgRez31QM9hwVyvd0M/exec";
    const url = new URL(req.url || '');
    const query = url.searchParams.toString();

    const response = await fetch(`${scriptUrl}?${query}`, {
      method: 'GET',
    });

    const text = await response.text();
    return new Response(text, { status: 200 });

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Proxy failed', { status: 500 });
  }
}
