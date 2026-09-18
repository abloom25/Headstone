import { forbidden, verifyAdmin } from '../_lib/admin.js'

// 管理令牌校验：令牌 = 初始化时设置的管理密码
export async function onRequestPost(context) {
  const { request, env } = context
  return (await verifyAdmin(request, env)) ? Response.json({ ok: true }) : forbidden()
}
