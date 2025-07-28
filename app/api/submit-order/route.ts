// app/api/submit-order/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxN8n4a_gOJt5tbEMSgRQRn4s2u-tCCe9gOy7Jl7w9I897pREgdGmnJDwArne_5lV22/exec";

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
