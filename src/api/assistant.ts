import type { components, operations } from '#/openapi'

import { client } from '@/utils'

export type AssistantInfo = components['schemas']['AssistantEntity']
export type SearchParams = operations['AssistantController_findAll']['parameters']['query']

// 获取助手列表
export function getAssistantList(query?: SearchParams) {
  return client.GET('/api/assistant', { params: { query } })
}
// 创建助手
export function createAssistant(body: components['schemas']['CreateAssistantDto']) {
  return client.POST('/api/assistant', { body })
}
// 获取单个助手信息
export function getAssistantDetail(id: number) {
  return client.GET('/api/assistant/{id}', { params: { path: { id } } })
}
// 更新助手
export function updateAssistant(body: components['schemas']['UpdateAssistantDto']) {
  return client.PATCH('/api/assistant/{id}', {
    body,
    params: { path: { id: body.id } },
  })
}
// 删除助手
export function deleteAssistant(id: number) {
  return client.DELETE('/api/assistant/{id}', { params: { path: { id } } })
}
