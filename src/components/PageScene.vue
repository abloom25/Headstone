<script setup>
// 展览式页面外壳：左边一幅手绘插画，右边一栏文字。登录、初始化、未配置三页共用。
//
// 样式在 src/styles/page.css，不写在这里：插槽内容带的是调用方的 scoped id，
// 本组件的 scoped 样式够不着它们，只能走全局。而全局就必须圈在 .page 命名空间下——
// 裸类名会泄漏到别处同名的类上（.panel / .title / .en / .scene 全站都在用，
// 碑页的 .panel 就被漏进去的 flex-direction: column 压成了上下堆叠）。
defineProps({
  // 背景里的描边巨字
  ghost: { type: String, required: true },
})
</script>

<template>
  <section class="page">
    <span class="ghost" aria-hidden="true">{{ ghost }}</span>

    <!-- 左侧插画：固定，随页面渐显 -->
    <div class="ornament" aria-hidden="true">
      <slot name="art" />
    </div>

    <!-- 上下遮罩：只柔化背后的插画，不碰右栏文字 -->
    <div class="veil top" aria-hidden="true"></div>
    <div class="veil bottom" aria-hidden="true"></div>

    <!-- 右栏正文 -->
    <div class="panel">
      <slot />
    </div>
  </section>
</template>
