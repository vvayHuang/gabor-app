<template>
    <div ref="container" class="flex flex-col items-center justify-center min-h-screen">
        <!-- Logo Placeholder -->
        <div class="w-[300px] h-[300px] flex items-center justify-center"><img src="@/assets/logo.svg" alt=""></div>
        <div class="text-center space-y-2">
            <h1 class="headline-lg-emphasis text-inverse-on-surface">歡迎</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const container = ref<HTMLElement | null>(null)

onMounted(() => {
    // Timeline for the splash screen sequence
    // 1. Wait for 2 seconds
    // 2. Fade out and scale up slightly
    // 3. Navigate to login
    const tl = gsap.timeline({
        onComplete: () => {
            router.push('/login')
        }
    })

    if (container.value) {
        tl.to(container.value, {
            delay: 1,
            duration: 0.5,
            opacity: 0,
            scale: 0.9,
            ease: "power2.inOut"
        })
    }
})
</script>
