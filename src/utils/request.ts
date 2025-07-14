import type { paths } from '#/openapi' // 由openapi-typescript生成
import type { Middleware } from 'openapi-fetch'

import { LOGIN_PATH } from '@/config/constants'
import { $t } from '@/locales'
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
      if (response.status === 401) {
        // 令牌过期，刷新令牌
        const userStore = useUserStore()
        try {
          await userStore.refreshToken()
        } catch {
          // 刷新令牌失败，清除登录状态
          userStore.$reset()
          window.$message.error($t('authentication.loginAgainSubTitle'))
          // 跳转到登录页面
          const router = useRouter()
          await router.push({ path: LOGIN_PATH })
        }
      } else {
        window.$message.error(data.error.message)
      }
    }
    return new Response(JSON.stringify(data))
  },
}

export const client = createClient<paths>()
client.use(authMiddleware)
