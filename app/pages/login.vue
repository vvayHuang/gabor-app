<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loginContainer = ref<HTMLElement | null>(null)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// 如果使用者已經登入，直接跳轉
watch(user, (newUser) => {
    if (newUser) {
        router.push('/prepare')
    }
}, { immediate: true })

const handleAuth = async () => {
    if (!email.value || !password.value) {
        errorMessage.value = '請輸入電子信箱與密碼'
        return
    }

    loading.value = true
    errorMessage.value = ''

    try {
        // 1. 嘗試登入
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (!signInError) {
            router.push('/prepare')
            return
        }

        // 2. 如果登入失敗且錯誤訊息暗示帳號不存在或密碼錯誤，嘗試註冊 (建立新帳號)
        // 注意：這裡的邏輯是為了符合 UI 上的「登入或創建新帳號」
        if (signInError.message.includes('Invalid login credentials')) {
            const { error: signUpError } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
            })
            
            if (signUpError) throw signUpError
            
            // 如果註冊成功但需要驗證電子郵件，提示使用者
            errorMessage.value = '已為您建立新帳號，請檢查電子郵件以驗證。'
        } else {
            throw signInError
        }
    } catch (error: any) {
        errorMessage.value = error.message || '認證失敗'
    } finally {
        loading.value = false
    }
}

const handleGoogleLogin = async () => {
    loading.value = true
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/prepare`
            }
        })
        if (error) throw error
    } catch (error: any) {
        errorMessage.value = error.message || 'Google 登入失敗'
        loading.value = false
    }
}

onMounted(() => {
    if (loginContainer.value) {
        gsap.to(loginContainer.value, {
            duration: 0.6,
            opacity: 1,
            translateY: 0,
            ease: "power2.out"
        });
    }
})
</script>

<template>
    <div class="flex-1 flex flex-col items-center justify-center px-4 pt-8 space-y-8 bg-background overflow-hidden">
        <!-- Phase 3: Login Elements -->
        <div ref="loginContainer"
            class="flex flex-col items-center justify-center space-y-8 w-full max-w-sm opacity-0 translate-y-8">
            <div class="flex flex-col space-y-2 w-full">
                <h1 class="title-lg-emphasis text-on-background">登入或創建新帳號</h1>
                <p v-if="errorMessage" class="label-medium text-error">{{ errorMessage }}</p>
            </div>

            <!-- Input Fields -->
            <div class="w-full space-y-4">
                <TextField v-model="email" type="email" placeholder="電子信箱" :disabled="loading" />
                <TextField v-model="password" type="password" placeholder="密碼" :disabled="loading" />
                
                <!-- Primary Action -->
                <div class="pt-2">
                    <Buttons 
                        buttonStyle="Bordered - Prominent" 
                        size="Large" 
                        :label="loading ? '處理中...' : '登入'" 
                        :enabled="!loading"
                        @click="handleAuth" 
                    />
                </div>
            </div>

            <!-- Social Login -->
            <div class="w-full flex flex-col items-center space-y-4">
                <p class="title-sm text-on-background">或繼續使用</p>
                <div class="w-full space-y-3">
                    <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol" :enabled="!loading" @click="() => errorMessage = '目前尚未支援 Apple 登入'">
                        <template #icon>
                            <img src="@/assets/icons/apple.svg" alt="Apple" class="w-6 h-6" />
                        </template>
                    </Buttons>
                    <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol" :enabled="!loading" @click="handleGoogleLogin">
                        <template #icon>
                            <img src="@/assets/icons/google.svg" alt="Google" class="w-6 h-6" />
                        </template>
                    </Buttons>
                    <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol" :enabled="!loading" @click="() => errorMessage = '目前尚未支援 Figma 登入'">
                        <template #icon>
                            <img src="@/assets/icons/figma.svg" alt="Figma" class="w-6 h-6" />
                        </template>
                    </Buttons>
                </div>
            </div>

            <!-- Footer -->
            <div class="w-full text-center">
                <p class="body-sm text-on-surface-variant">
                    繼續即表示您同意我們的服務條款和隱私政策。
                </p>
            </div>
        </div>
    </div>
</template>
