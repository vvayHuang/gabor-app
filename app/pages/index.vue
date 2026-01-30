<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4">
        <!-- Splash Screen Elements -->
        <div ref="splashContainer" class="flex flex-col items-center justify-center absolute pointer-events-none">
            <div class="w-[300px] h-[300px] flex items-center justify-center">
                <img src="@/assets/logo.svg" alt="Gabor App Logo">
            </div>
            <div class="text-center space-y-2">
                <h1 class="headline-lg-emphasis text-inverse-on-surface">歡迎</h1>
            </div>
        </div>

        <!-- Login Elements -->
        <div ref="loginContainer" class="flex flex-col items-center justify-center space-y-12 w-full opacity-0">
            <div class="flex flex-col items-center space-y-2">
                <h1 class="headline-lg-emphasis text-inverse-on-surface">登入</h1>
                <p class="title-large-emphasis text-inverse-on-surface">很高興再次見到你！</p>
            </div>
            <div class="w-full max-w-sm space-y-6">
<Buttons variant="outline" icon="simple-icons:google" label="Sign in with Google"
        class="text-sm" />
    <Buttons variant="outline" icon="simple-icons:apple" label="Sign in with Apple"
        class="text-sm" />
    <Buttons variant="ghost" label="Skip for now" @click="handleLogin" class="text-sm" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const splashContainer = ref<HTMLElement | null>(null)
const loginContainer = ref<HTMLElement | null>(null)

const handleLogin = () => {
    router.push('/prepare');
};

onMounted(() => {
    if (splashContainer.value && loginContainer.value) {
        const tl = gsap.timeline();
        
        // Initial setup for login - it's invisible and scaled down
        gsap.set(loginContainer.value, { opacity: 0, scale: 0.9 });

        // Animation sequence
        tl.to(splashContainer.value, {
            delay: 1,
            duration: 0.5,
            opacity: 0,
            scale: 0.9,
            ease: "power2.inOut",
        })
        .to(loginContainer.value, {
            duration: 0.5,
            opacity: 1,
            scale: 1,
            ease: "power2.out"
        }, "-=0.3"); // Overlap animations for a smoother crossfade
    }
})
</script>