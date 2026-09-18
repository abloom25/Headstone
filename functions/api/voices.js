// 留言：公开可读可写；同一 IP 60 秒内只允许写一条
const RATE_LIMIT_MS = 60_000;

export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare(
    "SELECT id, text, created_at FROM voices ORDER BY id DESC LIMIT 200"
  ).all();
  return Response.json({
    voices: results.map((r) => ({ id: r.id, text: r.text, ts: r.created_at })),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(() => null);
  const text = String(body?.text ?? "")
    .trim()
    .slice(0, 60);
  if (!text) {
    return Response.json({ error: "empty" }, { status: 400 });
  }
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM voices WHERE ip = ? AND created_at > ?"
  )
    .bind(ip, Date.now() - RATE_LIMIT_MS)
    .first();
  if (recent.n > 0) {
    return Response.json({ error: "too_fast" }, { status: 429 });
  }
  const ts = Date.now();
  const res = await env.DB.prepare(
    "INSERT INTO voices (text, created_at, ip) VALUES (?, ?, ?)"
  )
    .bind(text, ts, ip)
    .run();
  return Response.json({ id: res.meta.last_row_id, text, ts });
}
