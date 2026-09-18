import { forbidden, noDb, verifyAdmin } from '../_lib/admin.js'

// 单条愿望：勾选（PATCH）与删除（DELETE），均需管理员令牌
export async function onRequestPatch(context) {
  const { request, env, params } = context
  if (!env.DB) return noDb()
  if (!(await verifyAdmin(request, env))) return forbidden()

  const id = Number(params.id)
  if (!Number.isInteger(id)) return Response.json({ error: 'bad_id' }, { status: 400 })

  const body = await request.json().catch(() => null)
  const done = body?.done ? 1 : 0
  const res = await env.DB.prepare('UPDATE wishes SET done = ? WHERE id = ?').bind(done, id).run()
  if (res.meta.changes === 0) {
    return Response.json({ error: 'not_found' }, { status: 404 })
  }
  return Response.json({ id, done: Boolean(done) })
}

export async function onRequestDelete(context) {
  const { request, env, params } = context
  if (!env.DB) return noDb()
  if (!(await verifyAdmin(request, env))) return forbidden()

  const id = Number(params.id)
  if (!Number.isInteger(id)) return Response.json({ error: 'bad_id' }, { status: 400 })

  await env.DB.prepare('DELETE FROM wishes WHERE id = ?').bind(id).run()
  return Response.json({ ok: true })
}
