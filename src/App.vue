<script setup>
import { onBeforeUnmount, ref } from 'vue'
import epitaph from './epitaph'
import Tombstone from './components/Tombstone.vue'
import Dust from './components/Dust.vue'
import FlowerSpot from './components/FlowerSpot.vue'

// 蜡烛：点亮 / 熄灭，熄灭时有几缕青烟
const lit = ref(true)
const smoking = ref(false)
let smokeTimer
function toggleCandle() {
  lit.value = !lit.value
  clearTimeout(smokeTimer)
  if (lit.value) {
    smoking.value = false
  } else {
    smoking.value = true
    smokeTimer = setTimeout(() => (smoking.value = false), 6000)
  }
}
onBeforeUnmount(() => clearTimeout(smokeTimer))

// 献花：点任意处，一朵白花落在碑前，最多留 24 朵
const flowers = ref([])
let seq = 0
function plantFlower(e) {
  const vx = (e.clientX / window.innerWidth) * 100
  flowers.value.push({
    id: ++seq,
    x: Math.min(92, Math.max(8, vx + (Math.random() * 8 - 4))),
    y: 80 + Math.random() * 8,
    rot: Math.random() * 24 - 12,
    s: 0.85 + Math.random() * 0.5,
    delay: Math.random() * 0.15,
  })
  if (flowers.value.length > 24) flowers.value.shift()
}
</script>

<template>
  <main class="scene" @click="plantFlower">
    <Dust />
    <p class="title">{{ epitaph.title }}</p>

    <Tombstone />
    <div class="ground" aria-hidden="true"></div>

    <button
      class="candle"
      type="button"
      :aria-pressed="lit"
      :title="lit ? '熄灭烛火' : '点亮烛火'"
      @click.stop="toggleCandle"
    >
      <span v-if="smoking && !lit" class="smoke" aria-hidden="true"><i /><i /><i /></span>
      <span v-show="lit" class="halo" aria-hidden="true"></span>
      <span v-show="lit" class="flame" aria-hidden="true"></span>
      <span class="wick" aria-hidden="true"></span>
      <span class="stick" aria-hidden="true"></span>
    </button>

    <FlowerSpot :flowers="flowers" />

    <footer class="hint">轻点任意处，献一朵白花&ensp;·&ensp;轻点烛火，点亮或熄灭</footer>
  </main>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20vh; /* 石碑落在地面上，而不是屏幕底边 */
  background: radial-gradient(120vw 90vh at 50% 32%, #101010 0%, #060606 55%, #020202 100%);
  overflow: hidden;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.title {
  position: absolute;
  top: 7vh;
  left: 0;
  right: 0;
  z-index: 3;
  margin: 0;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.85em;
  text-indent: 0.85em;
  color: #8a8a8a;
  pointer-events: none;
  animation: fade 2s ease-out both;
}

.ground {
  position: absolute;
  left: 6vw;
  right: 6vw;
  bottom: 20vh;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.32) 18%,
    rgba(255, 255, 255, 0.32) 82%,
    transparent
  );
  pointer-events: none;
}

/* --- 蜡烛 --- */
.candle {
  position: absolute;
  z-index: 4;
  bottom: calc(20vh - 1px);
  left: calc(50% - min(150px, 34vw));
  width: 44px;
  height: 82px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.candle:focus-visible {
  outline: 1px dotted #888;
  outline-offset: 6px;
}

.stick {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 11px;
  height: 34px;
  border-radius: 3px 3px 2px 2px;
  background: linear-gradient(180deg, #f2f2f2, #8f8f8f);
}

.wick {
  position: absolute;
  bottom: 33px;
  left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  height: 5px;
  background: #777;
}

.flame {
  position: absolute;
  bottom: 37px;
  left: 50%;
  width: 14px;
  height: 24px;
  transform-origin: 50% 100%;
  transform: translateX(-50%);
  border-radius: 50% 50% 50% 50% / 64% 64% 36% 36%;
  background: radial-gradient(circle at 50% 72%, #fff 0%, #d9d9d9 40%, rgba(255, 255, 255, 0) 72%);
  filter: blur(0.5px);
  animation: flick 0.9s ease-in-out infinite alternate;
  pointer-events: none;
}

.halo {
  position: absolute;
  bottom: 24px;
  left: 50%;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0) 60%);
  transform: translateX(-50%);
  animation: breathe 3.2s ease-in-out infinite;
  pointer-events: none;
}

.smoke i {
  position: absolute;
  bottom: 40px;
  left: 50%;
  width: 8px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  filter: blur(3px);
  animation: wisp 2.6s ease-out infinite;
  pointer-events: none;
}

.smoke i:nth-child(2) {
  left: 58%;
  animation-delay: 0.6s;
}

.smoke i:nth-child(3) {
  left: 42%;
  animation-delay: 1.2s;
}

.hint {
  position: absolute;
  bottom: 6vh;
  left: 0;
  right: 0;
  z-index: 3;
  margin: 0;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: #616161;
  pointer-events: none;
  animation: fade 2.4s ease-out both;
}

@keyframes flick {
  from {
    transform: translateX(-50%) rotate(-2.5deg) scale(0.96, 1);
  }
  to {
    transform: translateX(-50%) rotate(2.5deg) scale(1.04, 1.07);
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.7;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.12);
  }
}

@keyframes wisp {
  0% {
    transform: translate(-50%, 0) scale(0.5);
    opacity: 0;
  }
  18% {
    opacity: 0.65;
  }
  100% {
    transform: translate(calc(-50% + 16px), -74px) scale(1.9);
    opacity: 0;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flame,
  .halo,
  .smoke i,
  .title,
  .hint {
    animation: none;
  }
}
</style>
