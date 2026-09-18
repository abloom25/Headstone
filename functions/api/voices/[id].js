// 删除留言：需要管理员令牌
export async function onRequestDelete(context) {
  const { request, env, params } = context;
  const token = request.headers.get("X-Admin-Token");
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  await env.DB.prepare("DELETE FROM voices WHERE id = ?")
    .bind(Number(params.id))
    .run();
  return Response.json({ ok: true });
}
