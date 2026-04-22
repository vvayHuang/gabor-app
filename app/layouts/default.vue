<template>
    <!-- Screen Background (Uniform Color) -->
    <div class="min-h-screen bg-surface flex justify-center selection:bg-gray-700 selection:text-white">
        
        <!-- App Container (Constrained Width on Desktop, Unified Style) -->
        <div class="w-full max-w-[440px] min-h-screen text-on-surface antialiased relative flex flex-col">
            
            <!-- Global Background Noise (Inside Container) -->
            <div class="absolute inset-0 pointer-events-none z-0">
                <svg class="w-full h-full opacity-[0.03] grayscale">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
            
            <!-- Main Content Area -->
            <main class="flex-1 w-full pt-status-bar transition-all duration-300 relative z-10 overflow-x-hidden">
                <slot />
            </main>

            <!-- Bottom Navigation -->
            <NavigationBar v-if="showNavigationBar" class="sticky bottom-0 z-50" />
        </div>
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
        'tutorial',
    ];

    return visiblePages.includes(route.name as string);
});
</script>
