<template>
    <div class="flex-1 flex flex-col items-center justify-center bg-background overflow-hidden relative">
        <!-- Splash Screen Elements -->
        <div class="flex flex-col items-center justify-center absolute inset-0 pointer-events-none">
            <!-- Phase 1: Logo Section -->
            <div ref="logoContainer" class="flex items-center justify-center opacity-0 scale-90">
                <Logo class="w-[200px] h-auto text-on-background" />
            </div>

            <!-- Phase 2: Welcome Text Section -->
            <div ref="welcomeTextContainer" class="flex flex-col items-center space-y-2 opacity-0 absolute">
                <h1 class="headline-lg-emphasis text-on-background">歡迎</h1>
                <p class="headline-sm text-on-background opacity-80">很高興再次見到你！</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useAppSettings } from '~/composables/useAppSettings';

const router = useRouter()
const settings = useAppSettings()
const user = useSupabaseUser()
const logoContainer = ref<HTMLElement | null>(null)
const welcomeTextContainer = ref<HTMLElement | null>(null)

// useSupabaseUser() stays null until the stored session is verified over the network,
// so a failed check at launch would show the login page to a signed-in user.
// The session itself lives in cookies named after cookiePrefix (split into `.0`, `.1`, ...
// when large); checking for them works offline. Empty ones are leftovers of a deletion
// (see plugins/supabase-cookie-cleanup.client.ts), not a session.
const sessionCookiePrefix = useRuntimeConfig().public.supabase.cookiePrefix
const hasStoredSession = () =>
    document.cookie.split('; ').some((cookie) => {
        const separator = cookie.indexOf('=')
        const name = cookie.slice(0, separator)
        const value = cookie.slice(separator + 1)
        return value !== '' && (name === sessionCookiePrefix || name.startsWith(`${sessionCookiePrefix}.`))
    })

onMounted(() => {
    settings.loadSettings();
    if (logoContainer.value && welcomeTextContainer.value) {
        const tl = gsap.timeline({
            onComplete: () => {
                // 動畫結束後檢查登入狀態：本機有 session（即使還沒連網驗證）就進準備頁；
                // 未登入（包含選過「先不登入」的訪客）每次都回到登入頁重新選擇
                if (user.value || hasStoredSession()) {
                    router.push('/prepare');
                } else {
                    router.push('/login');
                }
            }
        });

        // Animation sequence
        tl
            // 1. Show Logo alone
            .to(logoContainer.value, {
                duration: 0.8,
                opacity: 1,
                scale: 1,
                ease: "power2.out",
                delay: 0.5
            })
            // 2. Hide Logo
            .to(logoContainer.value, {
                duration: 0.5,
                opacity: 0,
                scale: 0.95,
                ease: "power2.inOut",
                delay: 1.0
            })
            // 3. Show Welcome Text
            .to(welcomeTextContainer.value, {
                duration: 0.8,
                opacity: 1,
                ease: "power2.out"
            })
            // 4. Hide Welcome Text
            .to(welcomeTextContainer.value, {
                duration: 0.5,
                opacity: 0,
                ease: "power2.inOut",
                delay: 1.2
            });
    }
})
</script>
