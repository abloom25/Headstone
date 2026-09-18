import { createRouter, createWebHistory } from 'vue-router'
import TombView from './pages/TombView.vue'
import WishView from './pages/WishView.vue'
import VoiceView from './pages/VoiceView.vue'
import LoginView from './pages/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/bei' },
    { path: '/bei', name: 'bei', component: TombView, meta: { title: '墓 · RIP' } },
    { path: '/yuan', name: 'yuan', component: WishView, meta: { title: '愿 · RIP' } },
    { path: '/yan', name: 'yan', component: VoiceView, meta: { title: '言 · RIP' } },
    { path: '/login', name: 'login', component: LoginView, meta: { title: '登录 · RIP' } },
    { path: '/:pathMatch(.*)*', redirect: '/bei' },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ?? '墓 · RIP'
})

export default router
