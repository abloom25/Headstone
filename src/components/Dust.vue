<script setup>
// 缓缓下落的尘埃，让黑色背景有一点「呼吸感」。
// 数量随屏幕收放：窄屏减半，声明了减少动效就一粒都不放——
// 这一层要和两条 backdrop-filter、每页的 SVG 置换滤镜共享同一块 GPU。
function grains() {
  if (typeof window === 'undefined') return 42
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0
  return window.innerWidth < 820 ? 18 : 42
}

const flakes = Array.from({ length: grains() }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 1 + Math.random() * 2,
  dur: 9 + Math.random() * 14,
  delay: -Math.random() * 20,
  drift: (Math.random() - 0.5) * 140,
  op: 0.12 + Math.random() * 0.4,
}))
</script>

<template>
  <div class="dust" aria-hidden="true">
    <span
      v-for="f in flakes"
      :key="f.id"
      :style="{
        left: f.left + 'vw',
        width: f.size + 'px',
        height: f.size + 'px',
        opacity: f.op,
        animationDuration: f.dur + 's',
        animationDelay: f.delay + 's',
        '--drift': f.drift + 'px',
      }"
    />
  </div>
</template>

<style scoped>
.dust {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.dust span {
  position: absolute;
  top: 0;
  border-radius: 50%;
  background: #fff;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall {
  from {
    transform: translate(0, -4vh);
  }
  to {
    transform: translate(var(--drift, 40px), 108vh);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dust span {
    animation: none;
  }
}
</style>
