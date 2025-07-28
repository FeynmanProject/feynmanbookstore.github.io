// app/api/submit-order/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scriptUrl = "https://script.google.com/macros/s/AKfycbyQR4SAOM-GGQYjcjJ7mfahvsrBQeHH9VfMEfGAI07gLR6zLpgRez31QM9hwVyvd0M/exec";

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.text();
    return new Response(result, { status: 200 });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response("Error forwarding request", { status: 500 });
  }
}
