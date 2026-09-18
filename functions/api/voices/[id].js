import { forbidden, noDb, verifyAdmin } from '../_lib/admin.js'

// 删除留言：需要管理员令牌
export async function onRequestDelete(context) {
  const { request, env, params } = context
  if (!env.DB) return noDb()
  if (!(await verifyAdmin(request, env))) return forbidden()

  const id = Number(params.id)
  if (!Number.isInteger(id)) return Response.json({ error: 'bad_id' }, { status: 400 })

  await env.DB.prepare('DELETE FROM voices WHERE id = ?').bind(id).run()
  return Response.json({ ok: true })
}
