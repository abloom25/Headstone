// 愿望列表：访客只读；新增需要管理员令牌
function isAdmin(request, env) {
  const token = request.headers.get("X-Admin-Token");
  return Boolean(env.ADMIN_TOKEN) && token === env.ADMIN_TOKEN;
}

export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare(
    "SELECT id, text, done, created_at FROM wishes ORDER BY id ASC"
  ).all();
  return Response.json({
    wishes: results.map((r) => ({ id: r.id, text: r.text, done: Boolean(r.done) })),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!isAdmin(request, env)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const text = String(body?.text ?? "")
    .trim()
    .slice(0, 40);
  if (!text) {
    return Response.json({ error: "empty" }, { status: 400 });
  }
  const ts = Date.now();
  const res = await env.DB.prepare(
    "INSERT INTO wishes (text, done, created_at) VALUES (?, 0, ?)"
  )
    .bind(text, ts)
    .run();
  return Response.json({ id: res.meta.last_row_id, text, done: false });
}
