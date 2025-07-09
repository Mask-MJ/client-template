import type { paths } from '#/openapi' // 由openapi-typescript生成
import type { Middleware } from 'openapi-fetch'

import createClient from 'openapi-fetch'
import { storeToRefs } from 'pinia'

const UNPROTECTED_ROUTES = ['/api/authentication/refresh-token', '/api/authentication/sign-in']

const authMiddleware: Middleware = {
  async onRequest({ request, schemaPath }) {
    // 获取令牌，如果不存在
    const userStore = useUserStore()
    const { token } = storeToRefs(userStore)
    if (UNPROTECTED_ROUTES.some((pathname) => schemaPath.startsWith(pathname))) {
      return undefined // don’t modify request for certain paths
    }
    request.headers.set('Authorization', `Bearer ${token.value.accessToken}`)
  },

  async onResponse({ response }) {
    const data = await response.clone().json()
    if (!response.status.toString().startsWith('2')) {
      window.$message.error(data.message)
    }
    return new Response(JSON.stringify(data))
  },
}

export const client = createClient<paths>()
client.use(authMiddleware)
