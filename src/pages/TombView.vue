<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import epitaph from '../epitaph'
import Tombstone from '../components/Tombstone.vue'
import FlowerSpot from '../components/FlowerSpot.vue'

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

// 献花：位置按屏幕百分比记录；窗口尺寸一变就直接清空（重种即可）
const flowers = ref([])
let seq = 0
function plantFlower(e) {
  const x = Math.min(92, Math.max(8, (e.clientX / window.innerWidth) * 100 + (Math.random() * 8 - 4)))
  const y = 78 + Math.random() * 8
  flowers.value.push({
    id: ++seq,
    x,
    y,
    rot: Math.random() * 24 - 12,
    s: 0.85 + Math.random() * 0.5,
  })
  if (flowers.value.length > 24) flowers.value.shift()
}

function onResize() {
  flowers.value = []
}
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  clearTimeout(smokeTimer)
})
</script>

<template>
  <main class="scene" @click="plantFlower">
    <span class="ghost" aria-hidden="true">{{ epitaph.ghost }}</span>

    <header class="topbar">
      <p class="title">{{ epitaph.title }}</p>
      <p class="en">{{ epitaph.en }}</p>
    </header>

    <section class="stage">
      <Tombstone />
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
    </section>
    <div class="ground" aria-hidden="true"></div>

    <FlowerSpot :flowers="flowers" />

    <section class="panel">
      <div class="words">
        <h1 class="name">{{ epitaph.name }}</h1>
        <div class="rule" aria-hidden="true"></div>
        <p class="born">生于 · {{ epitaph.born }}</p>
        <p class="died">卒于 · {{ epitaph.died }}</p>
      </div>
      <p class="quote-v">「{{ epitaph.quote }}」</p>
    </section>

    <footer class="hint">轻点任意处，献一朵白花&ensp;·&ensp;轻点烛火，点亮或熄灭</footer>
  </main>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  overflow: hidden;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

/* 背景描边巨字，压在排版区后面 */
.ghost {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 50%;
  transform: translate(6%, -54%);
  font-size: 76vh;
  line-height: 1;
  font-weight: 600;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.05);
  pointer-events: none;
  animation: ghost-in 2.4s ease-out both;
}

@supports not (-webkit-text-stroke: 1px #fff) {
  .ghost {
    color: rgba(255, 255, 255, 0.04);
  }
}

/* 顶栏：中文在左，英文在右 */
.topbar {
  position: absolute;
  z-index: 3;
  top: 5vh;
  left: 7vw;
  right: 7vw;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  pointer-events: none;
  animation: fade 1.8s ease-out both;
}

.title {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.5em;
  color: #a5a5a5;
}

.en {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #8a8a8a;
}

/* 左侧的石碑与地面 */
.stage {
  position: absolute;
  z-index: 2;
  left: 10vw;
  bottom: 20vh;
  width: min(38vw, 56vh, 320px);
}

/* 碑身始终跟随舞台宽度，避免组件自带宽度溢出容器 */
.stage :deep(.stone) {
  width: 100%;
}

.ground {
  position: absolute;
  left: 6vw;
  bottom: 20vh;
  width: 52vw;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.32) 12%,
    rgba(255, 255, 255, 0.32) 88%,
    transparent
  );
  pointer-events: none;
}

/* 右侧排版区：大字名字 + 生卒 + 竖排墓志铭 */
.panel {
  position: absolute;
  z-index: 3;
  right: 9vw;
  top: 50%;
  transform: translateY(-52%);
  display: flex;
  align-items: stretch;
  gap: 3.2vw;
  pointer-events: none;
}

.words {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.name {
  margin: 0;
  font-size: clamp(88px, 15vw, 200px);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.04em;
  color: #f0f0f0;
  animation: fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
}

.rule {
  width: 76px;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  margin: 4.5vh 0 3.2vh;
  transform-origin: left center;
  animation: grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
}

.born,
.died {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.32em;
  color: #b0b0b0;
  line-height: 2.1;
  animation: fade-up 1s ease-out both;
}

.born {
  animation-delay: 0.8s;
}

.died {
  animation-delay: 0.95s;
}

.quote-v {
  margin: 0;
  writing-mode: vertical-rl;
  font-size: 19px;
  letter-spacing: 0.42em;
  color: #e3e3e3;
  text-shadow: 0 0 14px rgba(0, 0, 0, 0.85);
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  padding-left: 3.2vw;
  animation: fade-up 1.1s ease-out 1.1s both;
}

.hint {
  position: absolute;
  z-index: 3;
  left: 7vw;
  bottom: 6vh;
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #8f8f8f;
  pointer-events: none;
  animation: fade 1.8s ease-out 0.4s both;
}

/* --- 蜡烛 --- */
.candle {
  position: absolute;
  z-index: 4;
  right: -58px;
  bottom: 0;
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

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
}

@keyframes ghost-in {
  from {
    opacity: 0;
  }
}

/* --- 窄屏：碑在上、排版在下，仍然不对称留白 --- */
@media (max-width: 820px) {
  .scene {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 6.5vh;
  }

  .stage {
    position: relative;
    left: auto;
    bottom: auto;
    width: min(58vw, 34vh);
  }

  .ground {
    position: static;
    width: 84vw;
  }

  .panel {
    position: static;
    transform: none;
    margin: 4vh 0 0;
    padding: 0 8vw;
    gap: 9vw;
    justify-content: center;
  }

  .name {
    font-size: clamp(60px, 17vw, 84px);
  }

  .rule {
    margin: 2vh 0 1.6vh;
  }

  .born,
  .died {
    font-size: 11px;
    line-height: 2;
  }

  .quote-v {
    font-size: 15px;
    letter-spacing: 0.34em;
    padding-left: 6vw;
    max-height: 26vh;
  }

  .ghost {
    font-size: 58vw;
    top: 2vh;
    transform: translate(8%, 0);
  }

  .topbar {
    top: 3.5vh;
    left: 6vw;
    right: 6vw;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }

  .en {
    font-size: 9px;
  }

  .hint {
    left: 6vw;
    right: 6vw;
    bottom: 6.5vh;
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.22em;
  }

  .candle {
    right: -46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flame,
  .halo,
  .smoke i,
  .topbar,
  .hint,
  .ghost,
  .name,
  .rule,
  .born,
  .died,
  .quote-v {
    animation: none;
  }
}
</style>
