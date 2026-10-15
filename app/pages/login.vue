<script setup lang="ts">
import { App } from '@capacitor/app'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import { createClient } from '@supabase/supabase-js'
import gsap from 'gsap'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { setGuestMode } = useGuestMode()

// 獲取設定資訊
const config = useRuntimeConfig()
const supabaseUrl = config.public.supabase.url
const supabaseKey = config.public.supabase.key

const loginContainer = ref<HTMLElement | null>(null)
const loading = ref(false)
const errorMessage = ref('')

// 處理 Deep Link 的函數
const handleDeepLink = async (urlStr: string) => {
    // 嚴格檢查：如果不是 Native 環境，絕對不執行手動解析
    if (!Capacitor.isNativePlatform()) return

    // 優先解析 Hash 中的 access_token (隱式流程)
    const hash = urlStr.split('#')[1]
    if (!hash) {
        // 備援：解析 Query 中的 code
        const url = new URL(urlStr)
        const code = url.searchParams.get('code')
        if (code) {
            try {
                const { error } = await supabase.auth.exchangeCodeForSession(code)
                if (error) throw error
                await nextTick()
                router.push('/prepare')
            } catch (e: any) {
                errorMessage.value = '認證失敗：' + e.message
            }
        }
        loading.value = false
        return
    }

    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    try {
        if (accessToken && refreshToken) {
            // 1. 設定 SDK Session；Supabase 模組會自己把 session 寫進 cookie
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            })
            if (sessionError) throw sessionError

            // 2. 直接在 App 內換頁。session 已經存進 cookie（CapacitorCookies），不需要重新載入；
            // 硬跳轉會讓 WebView 從首頁重新啟動，登入後又播一次歡迎動畫。
            await router.push('/prepare')
        }
    } catch (e: any) {
        console.error('Final Auth sync error:', e.message)
        errorMessage.value = '登入失敗：' + e.message
        loading.value = false
    }
}

let appListener: any = null

onMounted(async () => {
    if (loginContainer.value) {
        gsap.to(loginContainer.value, {
            duration: 0.6,
            opacity: 1,
            translateY: 0,
            ease: "power2.out"
        });
    }

    // 在原生環境監聽 URL 開啟
    if (Capacitor.isNativePlatform()) {
        // 使用 await 解決警告
        appListener = await App.addListener('appUrlOpen', (event: any) => {
            handleDeepLink(event.url)
        })
    }
})

onUnmounted(() => {
    if (appListener) {
        appListener.remove()
    }
})

// ... (watch user 邏輯不變)
watch(user, (newUser) => {
    if (newUser) {
        // 登入後就不再是訪客，登出時才會回到登入頁
        setGuestMode(false)
        router.push('/prepare')
    }
}, { immediate: true })

// 訪客：資料只存本機，之後登入時依 useGamePersistence 的規則帶進帳號
const handleGuestStart = () => {
    setGuestMode(true)
    router.push('/prepare')
}

const handleGoogleLogin = async () => {
    loading.value = true
    try {
        const isNative = Capacitor.isNativePlatform();
        const redirectTo = isNative 
            ? 'gaborapp://login-callback' 
            : `${window.location.origin}/prepare`;

        if (isNative) {
            // Native 環境：使用「非持久化」客戶端生成網址，避開 PKCE 錯誤
            const tempSupabase = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            })

            const { data, error } = await tempSupabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                    queryParams: { prompt: 'consent' }
                }
            })

            if (error) throw error
            if (data?.url) window.location.href = data.url;
        } else {
            // Web 環境：直接調用標準 SDK 流程，讓 Supabase 自動處理 PKCE 與 Session
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    // Web 端不需要 skipBrowserRedirect，讓 SDK 處理跳轉
                }
            })
            if (error) throw error
        }

    } catch (error: any) {
        console.error('Login error:', error.message);
        errorMessage.value = error.message;
        loading.value = false;
    }
}
</script>

<template>
    <div class="flex-1 flex flex-col items-center justify-center px-4 pt-8 space-y-8 bg-surface overflow-hidden relative">
        <!-- 登入頁專屬背景 (輕量 p5.js，行動裝置亦顯示) -->
        <ClientOnly>
            <AuthFlowField />
        </ClientOnly>

        <!-- Phase 3: Login Elements -->
        <div ref="loginContainer"
            class="flex flex-col items-center justify-center space-y-8 w-full max-w-sm opacity-0 translate-y-8 relative z-10">
            <div class="flex flex-col space-y-2 w-full items-center text-center">
                <h1 class="title-lg-emphasis text-on-background">選擇開始方式</h1>
                <p v-if="errorMessage" class="label-md text-error">{{ errorMessage }}</p>
            </div>

            <!-- Social Login -->
            <div class="w-full">
                <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol + Text" label="Continue with Google" :enabled="!loading" @click="handleGoogleLogin">
                    <template #icon>
                        <img src="@/assets/icons/google.svg" alt="Google" class="w-6 h-6" />
                    </template>
                </Buttons>
                <Buttons buttonStyle="Borderless" size="Large" labelType="Text" label="先不登入，直接開始" class="mt-2" :enabled="!loading" @click="handleGuestStart" />
            </div>

            <!-- Footer -->
            <div class="w-full text-center">
                <p class="body-sm text-on-surface-variant">
                    繼續即表示您同意我們的<a :href="TERMS_URL" target="_blank" rel="noopener" class="text-primary underline">服務條款</a>和<a :href="PRIVACY_URL" target="_blank" rel="noopener" class="text-primary underline">隱私政策</a>。
                </p>
            </div>
        </div>
    </div>
</template>
