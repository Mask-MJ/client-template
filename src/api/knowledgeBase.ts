import type { components, operations } from '#/openapi'

import { client } from '@/utils'

export type KnowledgeBaseInfo = components['schemas']['KnowledgeBaseEntity']
export type SearchParams = operations['KnowledgeBaseController_findAll']['parameters']['query']
export type SearchParamsWithDocument =
  operations['KnowledgeBaseController_findAllDocument']['parameters']['query']
// 获取知识库列表
export function getKnowledgeBaseList(query?: SearchParams) {
  return client.GET('/api/knowledge-base', { params: { query } })
}
// 创建知识库
export function createKnowledgeBase(body: components['schemas']['CreateKnowledgeBaseDto']) {
  return client.POST('/api/knowledge-base', { body })
}
// 获取单个知识库信息
export function getKnowledgeBaseDetail(id: number) {
  return client.GET('/api/knowledge-base/{id}', { params: { path: { id } } })
}
// 更新知识库
export function updateKnowledgeBase(body: components['schemas']['UpdateKnowledgeBaseDto']) {
  return client.PATCH('/api/knowledge-base/{id}', {
    body,
    params: { path: { id: body.id } },
  })
}
// 删除知识库
export function deleteKnowledgeBase(id: number) {
  return client.DELETE('/api/knowledge-base/{id}', { params: { path: { id } } })
}

// 下载知识库文件
export function downloadKnowledgeBaseFile(id: string, document_id: string) {
  return client.GET('/api/knowledge-base/{id}/documents/{document_id}', {
    params: { path: { id, document_id } },
    parseAs: 'stream',
  })
}

// 获取知识库文件列表
export function getKnowledgeBaseFileList(id: number, query?: SearchParamsWithDocument) {
  return client.GET('/api/knowledge-base/{id}/documents', {
    params: { path: { id }, query },
  })
}
