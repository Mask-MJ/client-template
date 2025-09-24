<script setup lang="ts">
import type { BubbleProps } from 'vue-element-plus-x/./types/Bubble'
import type { BubbleListInstance } from 'vue-element-plus-x/./types/BubbleList'
import type { ThinkingStatus } from 'vue-element-plus-x/./types/Thinking'

import { BubbleList, Sender, Thinking, XMarkdown } from 'vue-element-plus-x'

type MessageItem = BubbleProps & {
  avatar: string
  collapse?: boolean
  key: number
  reasoning_content?: string
  role: 'ai' | 'system' | 'user'
  thinkingStatus?: ThinkingStatus
}

// const userStore = useUserStore()

const senderValue = ref('')
const senderRef = ref()
const bubbleListRef = ref<BubbleListInstance | null>(null)
const bubbleItems = ref<MessageItem[]>([])
// 用户头像
// const avatar = computed(() => {
//   const userInfo = userStore.userInfo
//   return userInfo?.avatar || 'https://avatars.githubusercontent.com/u/76239030?v=4'
// })

async function handleSend() {
  // localStorage.setItem('chatContent', senderValue.value)
  // await sessionStore.createSessionList({
  //   userId: userStore.userInfo?.userId as number,
  //   sessionContent: senderValue.value,
  //   sessionTitle: senderValue.value.slice(0, 10),
  //   remark: senderValue.value.slice(0, 10),
  // })
}
</script>

<template>
  <div class="relative h-full w-full flex flex-col items-center">
    <BubbleList ref="bubbleListRef" :list="bubbleItems" max-height="calc(100vh - 240px)">
      <template #header="{ item }">
        <Thinking
          v-if="item.reasoning_content"
          v-model="item.collapse"
          :content="item.reasoning_content"
          :status="item.thinkingStatus"
          class="thinking-chain-warp"
        />
      </template>

      <template #content="{ item }">
        <!-- chat 内容走 markdown -->
        <XMarkdown
          v-if="item.content && item.role === 'system'"
          :markdown="item.content"
          class="markdown-body"
          :themes="{ light: 'github-light', dark: 'github-dark' }"
          default-theme-mode="dark"
        />
        <!-- user 内容 纯文本 -->
        <div v-if="item.content && item.role === 'user'" class="user-content">
          {{ item.content }}
        </div>
      </template>
    </BubbleList>
    <Sender
      ref="senderRef"
      v-model="senderValue"
      class="absolute bottom-0 w-full"
      :auto-size="{ maxRows: 6, minRows: 2 }"
      variant="updown"
      clearable
      allow-speech
      @submit="handleSend"
    >
      <template #prefix>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap">
          <el-button round plain color="#626aef">
            <el-icon><Paperclip /></el-icon>
          </el-button>

          <n-button round>
            <template #icon>
              <i class="i-ant-design:global-outlined"></i>
            </template>
            <span>联网查询</span>
          </n-button>

          <n-button round>
            <template #icon>
              <i class="i-ant-design:node-index-outlined"></i>
            </template>
            <span>深度思考</span>
          </n-button>
        </div>
      </template>
    </Sender>
  </div>
</template>
