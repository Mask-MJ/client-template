import type { components, operations } from '#/openapi'

import { client } from '@/utils'

export type RoleInfo = components['schemas']['RoleEntity']
export type SearchParams = operations['RoleController_findAll']['parameters']['query']

// 获取角色列表
export function getRoleList(query?: SearchParams) {
  return client.GET('/api/system/role', { params: { query } })
}
// 创建角色
export function createRole(body: components['schemas']['CreateRoleDto']) {
  return client.POST('/api/system/role', { body })
}
// 获取单个角色信息
export function getRoleDetail(id: number) {
  return client.GET('/api/system/role/{id}', { params: { path: { id } } })
}
// 更新角色
export function updateRole(body: components['schemas']['UpdateRoleDto']) {
  return client.PATCH('/api/system/role/{id}', { body, params: { path: { id: body.id } } })
}
// 删除角色
export function deleteRole(id: number) {
  return client.DELETE('/api/system/role/{id}', { params: { path: { id } } })
}

/**
 * 1. 获取列表 用params
 * 2. 创建、更新(先通过id找到)用body
 * 3. 单个详情 | 删除 (先通过id找到)再操作
 */
