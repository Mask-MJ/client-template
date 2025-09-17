<script setup lang="ts">
import { downloadKnowledgeBaseFile } from '@/api/system/knowledgeBase'
import { downloadFileFromBlobPart } from '@/utils'

async function download() {
  const { response } = await downloadKnowledgeBaseFile(
    '78e5ae6691db11f084d3fa341edb7c4d',
    '9ae28c1a921111f0aea4fa341edb7c4d',
  )
  const contentDisposition = response.headers.get('content-disposition')
  const blob = await response.blob()
  const fileName = contentDisposition
    ? decodeURIComponent(
        (contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/) || [])[1] || 'unknown',
      ).replaceAll(/['"]/g, '')
    : 'unknown'
  downloadFileFromBlobPart({ source: blob, fileName })
}
</script>

<template>
  <div>
    analytics aaa

    <n-button @click="download">下载</n-button>
  </div>
</template>

<style lang="" scoped></style>
