<script setup>
// 「愿」与「言」共用的写入栏。
//
// 之前两边各写各的样式，结果窄屏只有「言」补了规则：16px 填充式输入框 + 整宽按钮，
// 而「愿」还停在 14px 的下划线框——iOS 一聚焦就把整页放大，而且没有提交按钮，
// 手机上只能靠键盘的回车键。统一到这里，样式只有一份。

defineProps({
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '' },
  maxlength: { type: Number, default: 60 },
  submitLabel: { type: String, default: '留下' },
  // 桌面宽度；窄屏一律占满，这个值不起作用
  width: { type: String, default: 'min(430px, 36vw)' },
  // 按钮何时出现：always = 桌面与手机都有；mobile = 只在窄屏出现，
  // 桌面留给回车，保持「愿」原本那一条线的清爽
  buttonOn: { type: String, default: 'always' },
  // 下面两个是可选的 v-model，传了才渲染对应输入框
  name: { type: String, default: undefined },
  namePlaceholder: { type: String, default: '' },
  honeypot: { type: String, default: undefined },
})

defineEmits(['update:modelValue', 'update:name', 'update:honeypot', 'submit'])
</script>

<template>
  <form
    class="addbar"
    :class="'btn-' + buttonOn"
    :style="{ '--addbar-w': width }"
    @submit.prevent="$emit('submit')"
  >
    <input
      v-if="name !== undefined"
      class="nameinput"
      :value="name"
      :placeholder="namePlaceholder"
      maxlength="12"
      autocomplete="off"
      @input="$emit('update:name', $event.target.value)"
    />

    <!-- 蜜罐：移出视口，正常人看不见也 tab 不到，机器人填了后端就假装收下 -->
    <div v-if="honeypot !== undefined" class="hpwrap" aria-hidden="true">
      <input
        :value="honeypot"
        tabindex="-1"
        autocomplete="off"
        @input="$emit('update:honeypot', $event.target.value)"
      />
    </div>

    <input
      class="textinput"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      autocomplete="off"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <button type="submit">{{ submitLabel }}</button>
  </form>
</template>

<style scoped>
/* 通用部分在 src/styles/form.css，这里只留 AddBar 独有的三样 */

.nameinput {
  flex: none;
  width: 170px;
}

.hpwrap {
  position: absolute;
  left: -9999px;
}

/* 桌面上「愿」不显示按钮，回车即可；按钮仍在 DOM 里，回车才有东西可提交 */
.addbar.btn-mobile button {
  display: none;
}

@media (max-width: 820px) {
  .nameinput {
    width: 100%;
  }

  /* 手机上没有回车提示，按钮必须露出来 */
  .addbar.btn-mobile button {
    display: block;
  }
}
</style>
