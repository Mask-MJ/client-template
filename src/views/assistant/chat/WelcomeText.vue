<!-- 欢迎提示词 -->
<script setup lang="ts">
import { Typewriter } from 'vue-element-plus-x'

const userStore = useUserStore()

const username = computed(() => userStore.userInfo?.username ?? '我是 Element Plus X')
</script>

<template>
  <div
    class="welcome-text mb-32px mt-12px w-full flex flex-wrap items-center justify-center text-center text-lg font-size-32px font-semibold line-height-32px"
  >
    <Typewriter
      :content="`你好，${username}`"
      :typing="{
        step: 2,
        interval: 45,
      }"
      :is-fog="{
        bgColor: '#fff',
      }"
    />
  </div>
</template>
