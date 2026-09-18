<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Dust from './components/Dust.vue'
import TombView from './pages/TombView.vue'
import WishView from './pages/WishView.vue'
import VoiceView from './pages/VoiceView.vue'

// 三页：碑（主页）· 愿（遗愿清单）· 言（留言）
const views = { bei: TombView, yuan: WishView, yan: VoiceView }
const titles = { bei: '墓 · RIP', yuan: '愿 · RIP', yan: '言 · RIP' }
const navs = [
  { key: 'bei', label: '碑' },
  { key: 'yuan', label: '愿' },
  { key: 'yan', label: '言' },
]

const page = ref(initPage())
function initPage() {
  const key = location.hash.replace(/^#\/?/, '')
  document.title = titles[views[key] ? key : 'bei']
  return views[key] ? key : 'bei'
}
function fromHash() {
  const key = location.hash.replace(/^#\/?/, '')
  page.value = views[key] ? key : 'bei'
  document.title = titles[page.value]
}
function go(key) {
  if (key === page.value) return
  location.hash = '#/' + key
}
onMounted(() => {
  window.addEventListener('hashchange', fromHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', fromHash))
</script>

<template>
  <div class="shell">
    <Dust />
    <Transition name="page" mode="out-in">
      <component :is="views[page]" :key="page" />
    </Transition>
    <nav class="nav">
      <button
        v-for="n in navs"
        :key="n.key"
        type="button"
        :class="{ active: page === n.key }"
        @click="go(n.key)"
      >
        {{ n.label }}
      </button>
    </nav>
  </div>
</template>

<style scoped>
.shell {
  position: fixed;
  inset: 0;
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

.nav button {
  padding: 2px 4px;
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: #808080;
  transition: color 0.4s;
}

.nav button:hover {
  color: #c0c0c0;
}

.nav button.active {
  color: #e8e8e8;
}

.page-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.page-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
