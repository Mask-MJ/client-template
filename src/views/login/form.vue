<script setup lang="ts">
import type { SignInParams } from '@/api/system/user'
import type { FormInst } from 'naive-ui'

const userStore = useUserStore()
const preferencesStore = usePreferencesStore()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`
const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || ''
const rememberMe = ref(!!localUsername)
const model = ref<SignInParams>({
  username: 'admin',
  password: '123456',
})
const loading = computed(() => userStore.loginLoading)
// 获取版权信息
const copyright = computed(() => preferencesStore.state.copyright)

function handleGo(path: string) {
  router.push(path)
}

async function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (errors) {
      window.$message.error('Validation failed')
    } else {
      try {
        await userStore.authLogin(model.value)
      } catch (error) {
        window.$message.error(`登录失败, ${error}`)
      }
    }
  })
}
</script>

<template>
  <div class="relative h-full flex-col-center px-6 lg:flex-initial lg:px-8">
    <div class="enter-x w-full sm:mx-auto md:max-w-md">
      <div class="mb-7 sm:mx-auto sm:max-w-md sm:w-full">
        <h2 class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl">
          {{ `${$t('authentication.welcomeBack')} 👋🏻` }}
        </h2>

        <p class="text-muted-foreground lg:text-md text-sm">
          <span class="text-muted-foreground">
            {{ $t('authentication.loginSubtitle') }}
          </span>
        </p>
      </div>
      <NForm
        ref="formRef"
        :model="model"
        size="large"
        label-placement="left"
        :rules="{
          username: {
            required: true,
            message: $t('authentication.usernameTip'),
            trigger: 'blur',
          },
          password: {
            required: true,
            message: $t('authentication.passwordErrorTip'),
            trigger: ['input', 'blur'],
          },
        }"
        @keydown.enter.prevent="handleSubmit"
      >
        <NFormItem path="username">
          <NInput v-model:value="model.username" :placeholder="$t('authentication.usernameTip')" />
        </NFormItem>
        <NFormItem path="password">
          <NInput
            v-model:value="model.password"
            :placeholder="$t('authentication.passwordTip')"
            type="password"
          />
        </NFormItem>
      </NForm>
      <div class="mb-6 flex justify-between">
        <div class="flex-center">
          <NCheckbox v-model:checked="rememberMe" name="rememberMe">
            {{ $t('authentication.rememberMe') }}
          </NCheckbox>
        </div>

        <span class="vben-link text-sm font-normal" @click="handleGo('/auth/forget-password')">
          {{ $t('authentication.forgetPassword') }}
        </span>
      </div>
      <NButton
        :class="{ 'cursor-wait': loading }"
        :loading="loading"
        type="primary"
        size="large"
        class="w-full"
        @click="handleSubmit"
      >
        {{ $t('common.login') }}
      </NButton>
    </div>
    <div class="absolute bottom-3 flex text-center text-xs">
      <Copyright v-if="copyright.enable" v-bind="copyright" />
    </div>
  </div>
</template>

<style lang="" scoped></style>
