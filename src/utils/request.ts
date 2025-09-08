import type { paths } from '#/openapi' // 由openapi-typescript生成
import type { Middleware } from 'openapi-fetch'

import { LOGIN_PATH } from '@/config/constants'
import { $t } from '@/locales'
import dayjs from 'dayjs'
import { has } from 'lodash-es'
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
        console.error('API Error:', data)
        const errorMessage = data.error?.message || []
        if (Array.isArray(errorMessage)) {
          errorMessage.forEach((msg) => {
            window.$message.error(msg)
          })
        } else if (typeof errorMessage === 'string') {
          window.$message.error(errorMessage)
        }
      }
    }

    if (has(data, 'list')) {
      data.list = data.list.map((item: any) => {
        if (has(item, 'createdAt'))
          item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        if (has(item, 'updatedAt'))
          item.updatedAt = dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
    }
    if (has(data, 'createdAt')) data.createdAt = dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')
    if (has(data, 'updatedAt')) data.updatedAt = dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')

    return new Response(JSON.stringify(data))
  },
}

export const client = createClient<paths>()
client.use(authMiddleware)
