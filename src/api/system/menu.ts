import type { components, operations } from '#/openapi'

import { client } from '@/utils'

export type MenuInfo = components['schemas']['MenuEntity']
export type SearchParams = operations['MenuController_findAll']['parameters']['query']

// 获取菜单列表
export function getMenuList(query?: SearchParams) {
  return client.GET('/api/system/menu', { params: { query } })
}
// 创建菜单
export function createMenu(body: components['schemas']['CreateMenuDto']) {
  return client.POST('/api/system/menu', { body })
}
// 获取单个菜单信息
export function getMenuDetail(id: number) {
  return client.GET('/api/system/menu/{id}', { params: { path: { id } } })
}
// 更新菜单
export function updateMenu(body: components['schemas']['UpdateMenuDto']) {
  return client.PATCH('/api/system/menu/{id}', { body, params: { path: { id: body.id } } })
}
// 删除菜单
export function deleteMenu(id: number) {
  return client.DELETE('/api/system/menu/{id}', { params: { path: { id } } })
}
