<script setup>
defineProps({
  flowers: { type: Array, required: true },
})
</script>

<template>
  <ul class="flowers" aria-hidden="true">
    <li
      v-for="f in flowers"
      :key="f.id"
      :style="{
        left: f.x + '%',
        top: f.y + '%',
        transform: `translate(-50%, -50%) rotate(${f.rot}deg) scale(${f.s})`,
      }"
    >
      <svg viewBox="0 0 24 30">
        <g fill="none" stroke="#f2f2f2" stroke-width="1.1" stroke-linecap="round">
          <line x1="12" y1="15" x2="12" y2="29" opacity="0.8" />
          <path d="M12 22 Q 7 21 6 17 Q 11 17 12 22" opacity="0.7" />
          <circle cx="12" cy="8" r="2.1" />
          <g>
            <ellipse cx="12" cy="3.4" rx="1.9" ry="3.2" />
            <ellipse cx="12" cy="3.4" rx="1.9" ry="3.2" transform="rotate(72 12 8)" />
            <ellipse cx="12" cy="3.4" rx="1.9" ry="3.2" transform="rotate(144 12 8)" />
            <ellipse cx="12" cy="3.4" rx="1.9" ry="3.2" transform="rotate(216 12 8)" />
            <ellipse cx="12" cy="3.4" rx="1.9" ry="3.2" transform="rotate(288 12 8)" />
          </g>
        </g>
      </svg>
    </li>
  </ul>
</template>

<style scoped>
.flowers {
  position: absolute;
  inset: 0;
  z-index: 6;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
}

.flowers li {
  position: absolute;
  width: 26px;
}

.flowers svg {
  display: block;
  width: 100%;
  height: auto;
}
</style>
