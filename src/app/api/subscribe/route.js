// app/api/subscribe/route.js
const LISTMONK_ENDPOINT = "https://email-marking.tailieutoan.vn/subscription/form";

export async function POST(req) {
  const body = await req.text();

  const res = await fetch(LISTMONK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return new Response(null, { status: res.ok ? 200 : res.status });
}