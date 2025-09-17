import type { components, operations } from '#/openapi'

import { client } from '@/utils'

export type KnowledgeBaseInfo = components['schemas']['KnowledgeBaseEntity']
export type SearchParams = operations['KnowledgeBaseController_findAll']['parameters']['query']

// 获取知识库列表
export function getKnowledgeBaseList(query?: SearchParams) {
  return client.GET('/api/system/knowledge-base', { params: { query } })
}
// 创建知识库
export function createKnowledgeBase(body: components['schemas']['CreateKnowledgeBaseDto']) {
  return client.POST('/api/system/knowledge-base', { body })
}
// 获取单个知识库信息
export function getKnowledgeBaseDetail(id: number) {
  return client.GET('/api/system/knowledge-base/{id}', { params: { path: { id } } })
}
// 更新知识库
export function updateKnowledgeBase(body: components['schemas']['UpdateKnowledgeBaseDto']) {
  return client.PATCH('/api/system/knowledge-base/{id}', {
    body,
    params: { path: { id: body.id } },
  })
}
// 删除知识库
export function deleteKnowledgeBase(id: number) {
  return client.DELETE('/api/system/knowledge-base/{id}', { params: { path: { id } } })
}

// 下载知识库文件
export function downloadKnowledgeBaseFile(id: string, document_id: string) {
  return client.GET('/api/system/knowledge-base/{id}/documents/{document_id}', {
    params: { path: { id, document_id } },
    parseAs: 'stream',
  })
}
