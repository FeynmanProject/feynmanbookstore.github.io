import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scriptUrl = "https://script.google.com/macros/s/AKfycbyQR4SAOM-GGQYjcjJ7mfahvsrBQeHH9VfMEfGAI07gLR6zLpgRez31QM9hwVyvd0M/exec";

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    return new Response(text, { status: 200 });

  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Proxy failed", { status: 500 });
  }
}
