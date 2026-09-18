import { forbidden, noDb, verifyAdmin } from './_lib/admin.js'

// 愿望列表：访客只读；新增需要管理员令牌
export async function onRequestGet(context) {
  const { env } = context
  if (!env.DB) return noDb()
  const { results } = await env.DB.prepare(
    'SELECT id, text, done, created_at FROM wishes ORDER BY id ASC',
  ).all()
  return Response.json({
    wishes: results.map((r) => ({ id: r.id, text: r.text, done: Boolean(r.done) })),
  })
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.DB) return noDb()
  if (!(await verifyAdmin(request, env))) return forbidden()

  const body = await request.json().catch(() => null)
  const text = String(body?.text ?? '')
    .trim()
    .slice(0, 40)
  if (!text) {
    return Response.json({ error: 'empty' }, { status: 400 })
  }
  const res = await env.DB.prepare('INSERT INTO wishes (text, done, created_at) VALUES (?, 0, ?)')
    .bind(text, Date.now())
    .run()
  return Response.json({ id: res.meta.last_row_id, text, done: false })
}
