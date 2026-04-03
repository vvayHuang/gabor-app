<template>
    <div
        class="min-h-screen bg-surface text-on-surface antialiased overflow-x-hidden selection:bg-gray-700 selection:text-white relative">
        <!-- Global Background Noise -->
        <div class="fixed inset-0 pointer-events-none z-0">
            <svg class="w-full h-full opacity-[0.03] grayscale">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <filter id="waveNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComposite operator="in" in2="SourceGraphic" result="compositeNoise" />
                    <feBlend mode="overlay" in="compositeNoise" in2="SourceGraphic" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
        </div>
        
        <!-- Main Content Area with safe area padding -->
        <main class="w-full min-h-screen transition-all duration-300">
            <slot />
        </main>

        <!-- Bottom Navigation: 移除了 transition 與隱藏限制 -->
        <NavigationBar v-if="showNavigationBar" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showNavigationBar = computed(() => {
    // 僅在指定頁面顯示導覽列
    const visiblePages = [
        'prepare',
        'records',
        'profile',
    ];

    return visiblePages.includes(route.name as string);
});
</script>
