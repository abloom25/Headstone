// 管理令牌校验：正确返回 ok，否则 403
export async function onRequestPost(context) {
  const { request, env } = context;
  const token = request.headers.get("X-Admin-Token");
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return Response.json({ ok: true });
}
