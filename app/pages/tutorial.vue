<template>
    <div class="flex-1 flex flex-col px-4 space-y-8 text-on-background">
        <!-- Header Section -->
        <ToolbarTop headline="如何遊玩" type="title" />

        <div class="flex-1 flex flex-col">
            <div class="space-y-4">
                <div class="space-y-2">
                    <h2 class="title-md-emphasis text-on-background">科學原理：蓋博符號</h2>
                    <p class="body-md text-on-surface-variant">
                        辨識不同角度的條紋圖案，可以有效刺激大腦視覺中樞，提升視覺學習效果。
                    </p>
                </div>
            </div>

            <!-- Carousel Component -->
            <TutorialCarousel class="flex-1" />
        </div>

        <!-- Bottom Action Area -->
        <div class="w-full max-w-md md:max-w-2xl mx-auto px-0 md:px-6 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <Buttons buttonStyle="Bordered - Prominent" size="Large" label="我準備好了" to="/prepare" />
        </div>
    </div>
</template>

<script setup lang="ts">
// Nuxt will automatically import TutorialCarousel and ToolbarTop components
</script>
