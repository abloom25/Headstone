// 状态探测：告诉前端「储存库是否已绑定」与「是否已完成初始化」
export async function onRequestGet(context) {
  const { env } = context

  // 没绑定 D1（未在 Cloudflare 面板配置数据库）
  if (!env.DB) {
    return Response.json({ configured: false, initialized: false })
  }

  try {
    const row = await context.env.DB.prepare(
      "SELECT value FROM settings WHERE key = 'admin_hash'",
    ).first()
    return Response.json({ configured: true, initialized: Boolean(row) })
  } catch {
    // settings 表不存在 = 已绑定但还没初始化
    return Response.json({ configured: true, initialized: false })
  }
}
