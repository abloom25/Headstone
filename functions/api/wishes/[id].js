// 单条愿望：勾选（PATCH）与删除（DELETE），均需管理员令牌
function isAdmin(request, env) {
  const token = request.headers.get("X-Admin-Token");
  return Boolean(env.ADMIN_TOKEN) && token === env.ADMIN_TOKEN;
}

export async function onRequestPatch(context) {
  const { request, env, params } = context;
  if (!isAdmin(request, env)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const done = body?.done ? 1 : 0;
  const res = await env.DB.prepare(
    "UPDATE wishes SET done = ? WHERE id = ?"
  )
    .bind(done, Number(params.id))
    .run();
  if (res.meta.changes === 0) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json({ id: Number(params.id), done: Boolean(done) });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  if (!isAdmin(request, env)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  await env.DB.prepare("DELETE FROM wishes WHERE id = ?")
    .bind(Number(params.id))
    .run();
  return Response.json({ ok: true });
}
