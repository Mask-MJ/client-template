<script setup lang="ts">
import type { SessionInfo } from '@/api/assistant'

import type {
  ConversationItem,
  ConversationMenuCommand,
} from 'vue-element-plus-x/./types/Conversations'

import { Conversations } from 'vue-element-plus-x'

import { getChatSessionList } from '@/api/assistant'
import { find } from 'lodash-es'
import { createProDrawerForm } from 'pro-naive-ui'

import Chat from './chat.vue'

const router = useRouter()
const loading = ref(false)
const searchName = ref('')
const activeId = ref<string>()

const activeSession = computed(() => find(sessionList.value, (item) => item.id === activeId.value))
const assistantId = computed(() => {
  const params = router.currentRoute.value.params as { id: string }
  return Number(params.id)
})

const sessionList = ref<SessionInfo[]>([])

// 内置菜单点击方法
function handleMenuCommand(command: ConversationMenuCommand, item: ConversationItem) {
  // 直接修改 item 是否生效
  if (command === 'delete') {
    // if (index !== -1) {
    //   menuTestItems.value.splice(index, 1)
    window.$message.success('删除成功')
    // }
  }
  if (command === 'rename') {
    item.label = '已修改'
    window.$message.success('重命名成功')
  }
}

const drawerForm = createProDrawerForm({
  onSubmit: async (values) => {
    loading.value = true
    console.warn('submit', values)
    // await updateMenu({ ...values, id: drawerForm.values.value.id as number })
    drawerForm.close()
  },
})

const edit = () => {
  drawerForm.open()
}

onMounted(async () => {
  const { data } = await getChatSessionList(assistantId.value)
  sessionList.value = data || []
  // console.log('sessionList', sessionList.value)
})
</script>

<template>
  <n-card content-style="height: calc(100vh - 85px)">
    <div class="h-full flex gap-4">
      <div class="w-70 flex flex-col">
        <div class="mb-4 flex-between py-2">
          <div class="text-xl font-bold">Conversations</div>
          <n-button size="small">
            <template #icon>
              <i class="i-ant-design:plus-outlined"></i>
            </template>
          </n-button>
        </div>
        <n-input v-model:value="searchName" class="mb-4" clearable>
          <template #prefix>
            <i class="i-ant-design:search-outlined"></i>
          </template>
        </n-input>

        <Conversations
          v-model:active="activeId"
          class="mb-4"
          :items="sessionList"
          :label-max-width="200"
          :show-tooltip="true"
          label-key="name"
          tooltip-placement="right"
          :tooltip-offset="35"
          show-to-top-btn
          show-built-in-menu
          @menu-command="handleMenuCommand"
        />
        <n-button block @click="edit">聊天设置</n-button>
      </div>
      <n-card :title="activeSession?.name || ''" :segmented="{ content: true, footer: 'soft' }">
        <Chat :id="activeId" :messages="activeSession?.messages || []" />
      </n-card>
    </div>
    <pro-drawer-form :form="drawerForm" :loading="loading">
      <pro-drawer-content :title="$t('page.assistant.editAssistant')" :native-scrollbar="false">
        <pro-input :title="$t('page.assistant.name')" path="name" required />
        <pro-textarea :title="$t('page.assistant.description')" path="description" />
        <pro-textarea
          :title="$t('page.assistant.empty_response')"
          :tooltip="$t('page.assistant.empty_response_desc')"
          path="empty_response"
        />
        <pro-textarea
          :title="$t('page.assistant.opener')"
          :tooltip="$t('page.assistant.opener_desc')"
          path="opener"
        />
        <pro-radio-group
          :title="$t('page.assistant.show_quote')"
          path="show_quote"
          :tooltip="$t('page.assistant.show_quote_desc')"
          :field-props="{
            type: 'button',
            options: [
              { label: $t('common.enable'), value: true },
              { label: $t('common.disable'), value: false },
            ],
          }"
        />
        <pro-select
          :title="$t('page.assistant.knowledgeBase')"
          path="knowledgeBase"
          :field-props="{
            options: [
              { label: '知识库 1', value: '1' },
              { label: '知识库 2', value: '2' },
            ],
          }"
        />
        <pro-textarea
          :title="$t('page.assistant.prompt')"
          :tooltip="$t('page.assistant.prompt_desc')"
          path="prompt"
        />
        <pro-digit
          :title="$t('page.assistant.similarity_threshold')"
          :tooltip="$t('page.assistant.similarity_threshold_desc')"
          path="similarity_threshold"
        />
        <pro-digit
          :title="$t('page.assistant.vector_similarity_weight')"
          :tooltip="$t('page.assistant.vector_similarity_weight_desc')"
          path="vector_similarity_weight"
        />
        <pro-digit
          :title="$t('page.assistant.top_n')"
          :tooltip="$t('page.assistant.top_n_desc')"
          path="top_n"
        />
        <pro-digit
          :title="$t('page.assistant.top_p')"
          :tooltip="$t('page.assistant.top_p_desc')"
          path="top_p"
        />
        <pro-digit
          :title="$t('page.assistant.temperature')"
          :tooltip="$t('page.assistant.temperature_desc')"
          path="temperature"
        />
      </pro-drawer-content>
    </pro-drawer-form>
  </n-card>
</template>
