import type { MenuInfo } from '@/api/system/menu'
import type { SignInEntity, SignInParams, UserInfo } from '@/api/system/user'
import type { RemovableRef } from '@vueuse/core'

import type { RouteMeta, Router } from 'vue-router'

import { getMenuList } from '@/api/system/menu'
import { getAccessCodesApi, getUserInfoApi, login } from '@/api/system/user'
import { DEFAULT_HOME_PATH } from '@/config/constants'
import { $t } from '@/locales'
import { router } from '@/router'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user-store', () => {
  // 权限码
  const accessCodes = ref<string[]>([])
  // 可访问的菜单列表
  const accessMenus = ref<MenuInfo[]>([])
  const token: RemovableRef<SignInEntity> = useStorage('TOKEN', {
    accessToken: '',
    refreshToken: '',
  })
  // 登录中
  const loginLoading = ref<boolean>(false)
  // 是否已经检查过权限
  const isAccessChecked = ref<boolean>(false)
  // 用户信息
  const userInfo = ref<null | UserInfo>(null)
  // 用户角色
  const userRoles = ref<string[]>([])

  const setAccessCodes = (codes: string[]) => {
    accessCodes.value = codes
  }

  const setAccessMenus = (menus: MenuInfo[] = []) => {
    accessMenus.value = menus
  }

  const setToken = (newToken: SignInEntity) => {
    token.value = newToken
  }

  const setIsAccessChecked = (checked: boolean) => {
    isAccessChecked.value = checked
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const setUserRoles = (roles: string[]) => {
    userRoles.value = roles
  }

  const fetchUserInfo = async () => {
    const { data } = await getUserInfoApi()
    if (data) {
      setUserInfo(data)
    }
    return data || null
  }

  const authLogin = async (params: SignInParams, onSuccess?: () => Promise<void> | void) => {
    let userInfoData: null | UserInfo = null
    try {
      loginLoading.value = true
      const { data } = await login(params)
      if (data && data.accessToken) {
        setToken(data)

        const { data: accessCodesData = [] } = await getAccessCodesApi()

        userInfoData = await fetchUserInfo()

        setAccessCodes(accessCodesData)
        await (onSuccess ? onSuccess() : router.push(DEFAULT_HOME_PATH))

        if (userInfoData?.nickname) {
          window.$notification.success({
            content: $t('authentication.loginSuccess'),
            description: `${$t('authentication.loginSuccessDesc')}:${userInfoData?.nickname}`,
            duration: 3000,
          })
        }
      }
    } finally {
      loginLoading.value = false
    }

    return {
      userInfo: userInfoData,
    }
  }

  const fetchMenuList = async (router: Router) => {
    const { data = [] } = await getMenuList()
    const menus = data.filter((menu) => menu.status && menu.type !== 'button')
    menus.forEach((menu) => {
      const { path, redirect, ...rest } = menu
      // 更新原始路由数据
      router.getRoutes().forEach((item) => {
        if (item.path === path) {
          item.redirect = redirect || item.redirect
          item.meta = { ...item.meta, ...(rest as unknown as RouteMeta) }
        }
      })
    })
    setAccessMenus(menus)
    return data || []
  }

  const getMenuByPath = (path: string) => {
    const findMenu = (menus: MenuInfo[], path: string): MenuInfo | undefined => {
      for (const menu of menus) {
        if (menu.path === path) {
          return menu
        }
        if (menu.children) {
          const matched = findMenu(menu.children, path)
          if (matched) {
            return matched
          }
        }
      }
    }
    return findMenu(accessMenus.value, path)
  }

  const resetState = () => {
    accessCodes.value = []
    accessMenus.value = []
    token.value = null
    isAccessChecked.value = false
    userInfo.value = null
    userRoles.value = []
  }

  return {
    accessCodes,
    accessMenus,
    token,
    loginLoading,
    isAccessChecked,
    userInfo,
    userRoles,

    $reset: resetState,

    authLogin,
    fetchMenuList,
    getMenuByPath,
    setAccessCodes,
    setAccessMenus,
    setToken,
    setIsAccessChecked,
    setUserInfo,
    fetchUserInfo,
    setUserRoles,
  }
})

// 解决热更新问题
const hot = import.meta.hot
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot))
}
