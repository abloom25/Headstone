<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { timeoutSignal } from './http'
import Dust from './components/Dust.vue'
import SetupView from './pages/SetupView.vue'
import InitView from './pages/InitView.vue'

// 三页：碑（主页）· 愿（遗愿清单）· 言（留言）；/login 为管理登录。
// 页面本身由 vue-router 渲染（见 src/router.js），这里只负责外壳与状态分支。
const navs = [
  { to: '/bei', label: '碑' },
  { to: '/yuan', label: '愿' },
  { to: '/yan', label: '言' },
]

const route = useRoute()
// 登录页不显示底部导航
const showNav = computed(() => route.path !== '/login')

// 页面状态机：loading → unconfigured（储存库未配置）/ uninitialized（未设管理密码）/ ready
const appState = ref('loading')

async function check() {
  appState.value = 'loading'
  try {
    const res = await fetch('/api/status', { signal: timeoutSignal(10000) })
    if (!res.ok) throw new Error('bad status')
    const data = await res.json()
    if (data.configured === false) appState.value = 'unconfigured'
    else appState.value = data.initialized ? 'ready' : 'uninitialized'
  } catch {
    // 后端没起来 / 没绑数据库，都引导到配置说明
    appState.value = 'unconfigured'
  }
}

onMounted(check)
</script>

<template>
  <div class="shell">
    <Dust />

    <!-- 状态分支：加载中 / 未配置 / 未初始化 / 正常页面 -->
    <p v-if="appState === 'loading'" class="booting">正在叩门…</p>
    <SetupView v-else-if="appState === 'unconfigured'" @recheck="check" />
    <InitView v-else-if="appState === 'uninitialized'" @done="check" />

    <div v-else class="stage" :key="route.path">
      <RouterView />
      <nav v-if="showNav" class="nav">
        <RouterLink v-for="n in navs" :key="n.to" :to="n.to">{{ n.label }}</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.shell {
  position: fixed;
  inset: 0;
}

.booting {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.4em;
  text-indent: 0.4em;
  color: #6f6f6f;
  animation: fade 1.2s ease-out both;
}

/* 页面层：切换时整层渐显（纯 CSS 动画，不依赖 JS 事件） */
.stage {
  position: absolute;
  inset: 0;
  animation: stage-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes stage-in {
  from {
    opacity: 0;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

.nav {
  position: fixed;
  z-index: 30;
  bottom: 2.2vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3.2em;
}

.nav a {
  padding: 6px 10px;
  font: inherit;
  font-size: 13px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  text-decoration: none;
  color: #808080;
  transition: color 0.4s;
}

.nav a:hover {
  color: #c0c0c0;
}

.nav a.router-link-active {
  color: #e8e8e8;
}

@media (prefers-reduced-motion: reduce) {
  .stage,
  .booting {
    animation: none;
  }
}
</style>
