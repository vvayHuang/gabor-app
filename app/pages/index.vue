<template>
    <div class="flex-1 flex flex-col items-center justify-center bg-background overflow-hidden relative">
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const logoContainer = ref<HTMLElement | null>(null)
const welcomeTextContainer = ref<HTMLElement | null>(null)

onMounted(() => {
    if (logoContainer.value && welcomeTextContainer.value) {
        const tl = gsap.timeline({
            onComplete: () => {
                // 動畫結束後跳轉至登入頁面
                router.push('/login');
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
