<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 bg-background overflow-hidden">
        <!-- Splash Screen Elements -->
        <div class="flex flex-col items-center justify-center absolute inset-0 pointer-events-none">
            <!-- Phase 1: Logo Section -->
            <div ref="logoContainer" class="flex items-center justify-center opacity-0 scale-90">
                <img src="@/assets/logo.svg" alt="Gabor App Logo" class="w-[200px] h-auto">
            </div>

            <!-- Phase 2: Welcome Text Section -->
            <div ref="welcomeTextContainer" class="flex flex-col items-center space-y-2 opacity-0 absolute">
                <h1 class="headline-lg-emphasis text-on-background">歡迎</h1>
                <p class="headline-sm text-on-background opacity-80">很高興再次見到你！</p>
            </div>
        </div>

        <!-- Phase 3: Login Elements -->
        <div ref="loginContainer"
            class="flex flex-col items-center justify-center space-y-8 w-full max-w-sm opacity-0 translate-y-8">
            <div class="flex flex-col space-y-2 w-full">
                <h1 class="title-lg-emphasis text-on-background">登入或創建新帳號</h1>
            </div>

            <!-- Input Fields -->
            <div class="w-full space-y-4">
                <TextField v-model="email" type="email" placeholder="電子信箱" />
                <TextField v-model="password" type="password" placeholder="密碼" />
            </div>

            <!-- Social Login -->
            <div class="w-full flex flex-col items-center space-y-4">
                <p class="title-sm text-on-background">或繼續使用</p>
                <div class="w-full space-y-3">
                    <Buttons buttonStyle="bordered" size="large" labelType="symbol" @click="handleLogin">
                        <template #icon>
                            <img src="@/assets/icons/apple.svg" alt="Apple" class="w-6 h-6" />
                        </template>
                    </Buttons>
                    <Buttons buttonStyle="bordered" size="large" labelType="symbol" @click="handleLogin">
                        <template #icon>
                            <img src="@/assets/icons/google.svg" alt="Google" class="w-6 h-6" />
                        </template>
                    </Buttons>
                    <Buttons buttonStyle="bordered" size="large" labelType="symbol" @click="handleLogin">
                        <template #icon>
                            <img src="@/assets/icons/figma.svg" alt="Figma" class="w-6 h-6" />
                        </template>
                    </Buttons>
                </div>
            </div>

            <!-- Footer -->
            <div class="w-full">
                <p class="body-sm text-on-surface-variant">
                    繼續即表示您同意我們的服務條款和隱私政策。
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const logoContainer = ref<HTMLElement | null>(null)
const welcomeTextContainer = ref<HTMLElement | null>(null)
const loginContainer = ref<HTMLElement | null>(null)

const email = ref('')
const password = ref('')

const handleLogin = () => {
    router.push('/prepare');
};

onMounted(() => {
    if (logoContainer.value && welcomeTextContainer.value && loginContainer.value) {
        const tl = gsap.timeline();

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
            })
            // 5. Show Login screen
            .to(loginContainer.value, {
                duration: 0.6,
                opacity: 1,
                translateY: 0,
                ease: "power2.out"
            });
    }
})
</script>