<template>
    <div class="flex-1 flex flex-col px-4 space-y-8">
        <!-- Header Section -->
        <ToolbarTop headline="如何遊玩" type="title" />
        
        <div class="space-y-4">
            <div class="space-y-4">
                <h2 class="title-md-emphasis text-on-background">科學原理：蓋博符號</h2>
                <p class="body-lg text-on-background">
                    蓋博符號是模擬人類視覺神經反應的最優化圖形。透過辨識不同角度與頻率的條紋圖案，可以有效刺激大腦視覺中樞，進而達到視覺學習（Perceptual
                    Learning）的訓練效果。
                </p>
            </div>
        </div>

        <!-- Carousel Component -->
        <TutorialCarousel />
    </div>
</template>

<script setup lang="ts">
// Nuxt will automatically import TutorialCarousel component
</script>
