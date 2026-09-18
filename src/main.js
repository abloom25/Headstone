import { createApp } from 'vue'
// 全局样式必须排在组件之前：等权重时后出现的胜出，
// 组件的 scoped 样式要能盖住共享版式，而不是反过来。
import './styles/base.css'
import './styles/page.css'
import './styles/form.css'
import App from './App.vue'
import router from './router'

// 兼容早期的 #/xxx 链接：#/yuan → /yuan，交给 history 路由
const legacy = location.hash.startsWith('#/') ? location.hash.slice(1) : ''

// 兜底：任何一处抛错都不该换来一片纯白。把话说清楚，总好过什么都不说。
function fatal(err, info) {
  console.error('[rip]', info ?? '', err)
  const el = document.getElementById('app')
  if (!el || el.dataset.fatal) return
  el.dataset.fatal = '1'
  el.innerHTML =
    '<div style="position:fixed;inset:0;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:14px;padding:0 8vw;text-align:center;' +
    'color:#8f8f8f;font-size:12px;letter-spacing:.3em;line-height:2">' +
    '<p style="margin:0">这块碑没能立起来。</p>' +
    '<p style="margin:0;font-size:11px;letter-spacing:.2em;color:#6f6f6f">' +
    '打开控制台能看到原因。</p></div>'
}

if (legacy) {
  location.replace(legacy + location.search)
} else {
  try {
    const app = createApp(App)
    app.config.errorHandler = (err, instance, info) => fatal(err, info)
    app.use(router).mount('#app')
  } catch (err) {
    fatal(err)
  }
}
