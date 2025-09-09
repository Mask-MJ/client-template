<script setup lang="ts">
import type { MenuInfo } from '@/api/system/menu'
import type { ProDataTableColumns } from 'pro-naive-ui'

import { getMenuList } from '@/api/system/menu'
import { $t } from '@/locales'
import { transformationTree } from '@/utils'
import { NTag } from 'naive-ui'

// const loading = ref(false)
const tableData = ref<MenuInfo[]>([])
const columns = computed<ProDataTableColumns<MenuInfo>>(() => [
  { title: $t('page.system.menu.name'), key: 'name' },
  {
    title: $t('page.system.menu.type'),
    key: 'type',
    render: (rowData) => {
      const typeMap = {
        link: 'info',
        catalog: 'warning',
        menu: 'success',
        embedded: 'primary',
        button: 'default',
      } as const
      return h(NTag, { type: typeMap[rowData.type] }, () => {
        //  "link" | "catalog" | "menu" | "embedded" | "button"
        return $t(`page.system.menu.${rowData.type}`)
      })
    },
  },
  { title: $t('page.system.menu.icon'), key: 'icon', render: (row) => h('i', { class: row.icon }) },
  { title: $t('page.system.menu.permission'), key: 'permission' },
  { title: $t('page.system.menu.path'), key: 'path' },
  {
    title: $t('common.status'),
    key: 'status',
    width: 100,
    render: (rowData) =>
      h(NTag, { type: rowData.status ? 'success' : 'error' }, () =>
        rowData.status ? '启用' : '停用',
      ),
  },
])
const getTableData = async () => {
  // loading.value = true
  const { data } = await getMenuList()
  tableData.value = transformationTree(data || [], null)
  // loading.value = false
}
onMounted(() => {
  getTableData()
})
</script>

<template>
  <n-flex class="h-full" vertical size="large">
    <pro-data-table
      :title="$t('page.system.menu.title')"
      row-key="id"
      :columns="columns"
      :data="tableData"
      :pagination="false"
    >
      <template #toolbar>
        <n-flex>
          <n-button type="primary" ghost>
            <template #icon>
              <i class="i-ant-design:plus-outlined"></i>
            </template>
            {{ $t('common.add') }}
          </n-button>
        </n-flex>
      </template>
    </pro-data-table>
    <!-- <pro-drawer-form :form="drawerForm" :loading="loading" >
      <pro-drawer-content
        :title="`${
          drawerForm.values.value.id
            ? $t('page.system.menu.editMenu')
            : $t('page.system.menu.addMenu')
        }`"
        :native-scrollbar="false"
      >
        <pro-radio-group
          :title="$t('page.system.menu.menuType')"
          path="type"
          :field-props="{
            type: 'button',
            options: translateOptions(typeOptions),
          }"
        />
        <div class="grid grid-cols-1 gap-x-0 md:grid-cols-2 md:gap-x-4">
          <menu-drawer-form v-if="drawerForm.values.value.type === menuTypeEnum.MENU" />
          <directory-drawer-form
            v-else-if="drawerForm.values.value.type === menuTypeEnum.DIRECTORY"
          />
        </div>
      </pro-drawer-content>
    </pro-drawer-form> -->
  </n-flex>
</template>

<style lang="" scoped></style>
