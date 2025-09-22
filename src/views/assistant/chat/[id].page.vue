<script setup lang="ts">
import { createProDrawerForm } from 'pro-naive-ui'

import Chat from './chat.vue'

const loading = ref(false)
const searchName = ref('')
const activeId = ref<null | string>(null)
const title = computed(() => {
  const active = sessionList.value.find((item) => item.id === activeId.value)
  return active ? active.name : 'Chat'
})

const sessionList = ref([
  {
    chat: '2ca4b22e878011ef88fe0242ac120005',
    create_date: 'Fri, 11 Oct 2024 08:46:43 GMT',
    create_time: 1_728_636_403_974,
    id: '578d541e87ad11ef96b90242ac120006',
    messages: [{ content: 'Hi! I am your assistant, can I help you?', role: 'assistant' }],
    name: 'new session 1',
    update_date: 'Fri, 11 Oct 2024 08:46:43 GMT',
    update_time: 1_728_636_403_974,
  },
  {
    chat: '2ca4b22e878011ef88fe0242ac120005',
    create_date: 'Fri, 11 Oct 2024 08:46:43 GMT',
    create_time: 1_728_636_403_974,
    id: '578d541e87ad11ef96b90242ac120007',
    messages: [{ content: 'Hi! I am your assistant, can I help you?', role: 'assistant' }],
    name: 'new session 2',
    update_date: 'Fri, 11 Oct 2024 08:46:43 GMT',
    update_time: 1_728_636_403_974,
  },
])

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
</script>

<template>
  <n-card content-style="height: calc(100vh - 85px)">
    <div class="h-full flex gap-4">
      <div class="w-60 flex flex-col">
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
        <n-scrollbar class="mb-4 flex-1 space-y-4">
          <div
            v-for="item in sessionList"
            :key="item.id"
            class="mb-2 cursor-pointer border-b-1 pb-2"
          >
            <div
              class="group flex-between items-center rounded p-2 hover:bg-gray-100"
              :class="{ 'bg-gray-100': activeId === item.id }"
              @click="activeId = item.id"
            >
              <div>{{ item.name }}</div>
              <n-button quaternary class="opacity-0 group-hover:opacity-100" size="small">
                <template #icon>
                  <i class="i-ant-design:delete-outlined"></i>
                </template>
              </n-button>
            </div>
          </div>
        </n-scrollbar>
        <n-button block @click="edit">聊天设置</n-button>
      </div>
      <n-card
        :title="title"
        :segmented="{
          content: true,
          footer: 'soft',
        }"
      >
        <Chat :id="activeId" />
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
