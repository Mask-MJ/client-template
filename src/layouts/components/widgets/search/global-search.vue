<script setup lang="ts">
// import type { MenuInfo } from '@/api/system/menu'

import { nextTick, onMounted, onUnmounted, ref } from 'vue'

import { $t } from '@/locales'
import { useMagicKeys, whenever } from '@vueuse/core'

// import SearchPanel from './search-panel.vue'

defineOptions({ name: 'GlobalSearch' })

const keyword = ref('')
const showModal = ref(false)
const searchInputRef = ref<HTMLInputElement>()

// function handleClose() {
//   keyword.value = ''
// }

const keys = useMagicKeys()
whenever(keys['ctrl+k']!, () => {
  showModal.value = true
})

whenever(open, () => {
  nextTick(() => {
    searchInputRef.value?.focus()
  })
})

const preventDefaultBrowserSearchHotKey = (event: KeyboardEvent) => {
  if (event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
  }
}

const toggleKeydownListener = () => {
  window.addEventListener('keydown', preventDefaultBrowserSearchHotKey)
}

onMounted(() => {
  toggleKeydownListener()

  onUnmounted(() => {
    window.removeEventListener('keydown', preventDefaultBrowserSearchHotKey)
  })
})
</script>

<template>
  <div>
    <NModal v-model:show="showModal" preset="card" class="w-[600px]" header-class="py-2 border-b">
      <div class="flex items-center">
        <i class="i-ant-design:search-outlined mr-2 size-4 text-gray-500"></i>
        <input
          ref="searchInputRef"
          v-model="keyword"
          :placeholder="$t('ui.widgets.search.searchNavigate')"
          class="w-[80%] border rounded-md border-none bg-transparent p-2 pl-0 text-sm font-normal outline-none ring-0 ring-none ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-transparent"
        />
      </div>

      <!-- <SearchPanel :keyword="keyword" :menus="menus" @close="handleClose" /> -->
      <template #footer>
        <div class="w-full flex justify-start text-xs">
          <div class="mr-2 flex items-center">
            <i class="i-ant-design:enter-outlined mr-1 size-3"></i>
            {{ $t('ui.widgets.search.select') }}
          </div>
          <div class="mr-2 flex items-center">
            <i class="i-ant-design:arrow-up-outlined mr-1 size-3"></i>
            <i class="i-ant-design:arrow-down-outlined mr-1 size-3"></i>
            {{ $t('ui.widgets.search.navigate') }}
          </div>
          <div class="flex items-center">
            <!-- <MdiKeyboardEsc class="mr-1 size-3" /> -->
            {{ $t('ui.widgets.search.close') }}
          </div>
        </div>
      </template>
    </NModal>
    <NButton round>
      <i class="i-ant-design:search-outlined size-4 hover:opacity-100"></i>
      <span class="hidden text-xs duration-300 md:block">
        {{ $t('ui.widgets.search.title') }}
      </span>
      <span
        class="bg-background border-foreground/60 relative hidden rounded-sm rounded-r-xl px-1.5 py-1 text-xs leading-none md:block group-hover:opacity-100"
      >
        Ctrl
        <kbd>K</kbd>
      </span>
    </NButton>
  </div>
</template>
