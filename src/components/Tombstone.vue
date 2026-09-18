<script setup>
import epitaph from '../epitaph'
</script>

<template>
  <figure class="stone">
    <svg viewBox="0 0 320 420" role="img" aria-label="墓碑">
      <defs>
        <!-- 让石碑边缘有一点点手工凿刻的不规则感 -->
        <filter id="roughen">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>
        <linearGradient id="stoneFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(255,255,255,0.055)" />
          <stop offset="1" stop-color="rgba(255,255,255,0.015)" />
        </linearGradient>
      </defs>

      <!-- 碑体外轮廓 -->
      <path
        d="M 44 404 L 44 158 C 44 74 96 34 160 34 C 224 34 276 74 276 158 L 276 404"
        fill="url(#stoneFill)"
        stroke="#d8d8d8"
        stroke-width="2.5"
        filter="url(#roughen)"
      />
      <!-- 内圈阴刻线 -->
      <path
        d="M 60 404 L 60 160 C 60 84 106 50 160 50 C 214 50 260 84 260 160 L 260 404"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        stroke-width="1"
      />

      <circle cx="160" cy="110" r="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" />
      <text x="160" y="148" class="rip">RIP</text>
      <text x="160" y="246" class="name">{{ epitaph.name }}</text>
      <text x="160" y="298" class="line">生于 · {{ epitaph.born }}</text>
      <text x="160" y="326" class="line">卒于 · {{ epitaph.died }}</text>
    </svg>
  </figure>
</template>

<style scoped>
.stone {
  position: relative;
  z-index: 2;
  width: min(76vw, 56vh, 330px);
  margin: 0;
  animation: rise 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

text {
  fill: #e8e8e8;
  text-anchor: middle;
}

.rip {
  font-size: 14px;
  letter-spacing: 8px;
  fill: #c9c9c9;
}

.name {
  font-size: 46px;
  letter-spacing: 10px;
  text-indent: 10px; /* 抵消最后一个字的字距，让视觉居中 */
}

.line {
  font-size: 13px;
  letter-spacing: 3px;
  fill: #bdbdbd;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stone {
    animation: none;
  }
}
</style>
