<script setup lang="ts">
const router = useRouter()
const tabbarStore = useTabbarStore()
const preferencesStore = usePreferencesStore()
const theme = computed(() => (preferencesStore.state.theme.mode === 'dark' ? 'dark' : 'light'))
const header = computed(() => preferencesStore.state.header)
const sidebar = computed(() => preferencesStore.state.sidebar)

const toggleSidebar = () => {
  preferencesStore.state.sidebar.collapsed = !sidebar.value.collapsed
}
async function refresh() {
  await tabbarStore.refresh(router)
}
</script>

<template>
  <NCard
    v-if="header.enable"
    v-show="!header.hidden"
    :class="theme"
    :bordered="false"
    class="h-12 w-full border-b pl-2 duration-200"
    content-class="!p-0 flex items-center justify-between"
  >
    <n-button quaternary size="small" class="!h-8 !w-8" @click="toggleSidebar">
      <template #icon>
        <i
          :class="
            sidebar.collapsed
              ? 'i-ant-design:menu-unfold-outlined'
              : 'i-ant-design:menu-fold-outlined'
          "
        ></i>
      </template>
    </n-button>
    <n-button quaternary size="small" class="!h-8 !w-8" @click="refresh">
      <template #icon>
        <i class="i-ant-design:reload-outlined"></i>
      </template>
    </n-button>
  </NCard>
</template>

<style lang="" scoped></style>
