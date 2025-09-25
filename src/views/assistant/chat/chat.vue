<script setup lang="ts">
import type { BubbleProps } from 'vue-element-plus-x/./types/Bubble'
import type { BubbleListInstance } from 'vue-element-plus-x/./types/BubbleList'
import type { ThinkingStatus } from 'vue-element-plus-x/./types/Thinking'

import { BubbleList, Sender, Thinking, XMarkdown } from 'vue-element-plus-x'

type MessageItem = BubbleProps & {
  collapse?: boolean
  content?: string
  key?: number
  role: 'assistant' | 'system' | 'user' | String
  thinkingStatus?: ThinkingStatus
}

const props = defineProps<{
  id: string | undefined
  messages: MessageItem[]
}>()

const userStore = useUserStore()

const senderValue = ref('')
const senderRef = ref()
const bubbleListRef = ref<BubbleListInstance | null>(null)
const bubbleItems = computed<MessageItem[]>(() => {
  return props.messages.map((item, index) => ({
    role: item.role,
    key: index,
    content: item.content,
    placement: item.role === 'assistant' ? 'start' : 'end',
    avatarSize: '32px',
    avatarGap: '12px', // 头像与气泡之间的距离
    isMarkdown: item.role === 'assistant', // 是否是 markdown 格式
    noStyle: item.role === 'user', // user 走纯文本
    avatar: item.role === 'assistant' ? avatar.value : undefined,
  }))
})

const avatar = computed(() => {
  const userInfo = userStore.userInfo
  return userInfo?.avatar || '/src/assets/logo.png'
})

// 提取 <think></think> 之间的内容返回, 其余的内容去掉
function replaceThink(text: string = '') {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g
  let match
  let result = ''
  match = thinkRegex.exec(text)
  while (match !== null) {
    result += match[1]
    match = thinkRegex.exec(text)
  }
  return result.trim()
}

// 提取 <think></think> 之外的内容返回, 中间的内容去掉
const replaceWithoutThink = (content: string) => {
  return content.replaceAll(/<think>[\s\S]*?<\/think>/g, '').trim()
}

async function handleSend() {
  // console.log('发送内容', senderValue.value)
  // console.log(bubbleItems.value)
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
    <div class="w-full flex flex-col justify-between">
      <BubbleList
        ref="bubbleListRef"
        class="bubble-list"
        :list="bubbleItems"
        max-height="calc(100vh - 360px)"
      >
        <!-- 自定义头像 -->
        <template #avatar="{ item }">
          <div class="avatar-wrapper">
            <i v-if="item.role === 'assistant'" class="i-ant-design:robot-outlined"></i>
            <img v-else :src="avatar" alt="avatar" />
          </div>
        </template>
        <template #header="{ item }">
          <Thinking
            v-if="item.content && item.role === 'assistant' && item.content.includes('<think>')"
            v-model="item.collapse"
            :content="replaceThink(item.content)"
            :status="item.thinkingStatus"
            class="thinking-chain-warp mb-2"
            max-width="100%"
          />
        </template>

        <template #content="{ item }">
          <!-- chat 内容走 markdown -->
          <XMarkdown
            v-if="item.content && item.role === 'assistant'"
            :markdown="replaceWithoutThink(item.content)"
            class="w-full"
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
          <div class="flex items-center gap-2">
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
  </div>
</template>

<style scoped lang="css">
.thinking-chain-warp {
  margin-bottom: 12px;
}
:deep() .el-bubble-list {
  padding-top: 24px;
}
:deep() .el-bubble {
  padding: 0 12px;
  padding-bottom: 24px;
}
:deep() .el-typewriter {
  overflow: hidden;
  border-radius: 12px;
}
:deep() .user-content {
  white-space: pre-wrap;
}
:deep() .markdown-body {
  background-color: transparent;
}
:deep() .markdown-elxLanguage-header-div {
  top: -25px !important;
}

:deep() .elx-xmarkdown-container {
  padding: 8px 4px;
}
:deep() .el-bubble-content {
  max-width: 100% !important;
}
</style>
