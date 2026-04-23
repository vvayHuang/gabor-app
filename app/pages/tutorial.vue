<template>
    <div class="flex-1 flex flex-col px-4 space-y-8">
        <!-- Header Section -->
        <div class="space-y-4">
            <h1 class="headline-lg-emphasis text-on-background">如何遊玩</h1>
            <div class="space-y-4">
                <h2 class="title-md-emphasis text-on-background">科學原理：蓋博符號</h2>
                <p class="body-lg text-on-background">
                    蓋博符號是模擬人類視覺神經反應的最優化圖形。透過辨識不同角度與頻率的條紋圖案，可以有效刺激大腦視覺中樞，進而達到視覺學習（Perceptual
                    Learning）的訓練效果，讓你看得更清晰、反應更靈敏。
                </p>
            </div>
        </div>

        <!-- Carousel / Grid Illustration Section -->
        <div class="flex-1 flex flex-col items-center justify-center">
            <!-- 2x3 Grid Illustration -->
            <div class="grid grid-cols-3 gap-4 w-full max-w-[320px]">
                <div v-for="i in 6" :key="i">
                    <img :src="getShapePath(i)" class="w-full h-full object-contain mix-blend-multiply scale-75" />
                </div>
            </div>

            <!-- Content for the specific step -->
            <div class="text-left w-full px-4 py-2">
                <h3 class="title-lg text-on-background mb-2">觀察盤面</h3>
                <p class="body-lg text-on-background">螢幕上會出現許多成對出現的蓋博符號</p>
            </div>

            <!-- Page Control (Dots) -->
            <div class="flex justify-center items-center w-full gap-2 h-11">
                <div v-for="i in 3" :key="i" class="h-2 w-2 rounded-full transition-all duration-300"
                    :class="[i === 1 ? 'w-2 bg-primary' : 'bg-outline-variant']"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// Correctly import assets for Vite to resolve dynamic paths
import shape1 from '@/assets/shape/shape-1.svg'
import shape2 from '@/assets/shape/shape-2.svg'
import shape3 from '@/assets/shape/shape-3.svg'
import shape4 from '@/assets/shape/shape-4.svg'
import shape5 from '@/assets/shape/shape-5.svg'

const router = useRouter()

const shapes = [shape1, shape2, shape3, shape4, shape5]

const getShapePath = (index: number) => {
    // Cycle through available shapes 1-5
    return shapes[(index - 1) % shapes.length]
}
</script>

<style scoped>
/* Ensure the page stays clean without unwanted scrolling if content fits */
</style>
