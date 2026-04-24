<template>
    <!-- Screen Background (Uniform Color) -->
    <div class="min-h-screen bg-surface flex justify-center selection:bg-gray-700 selection:text-white">
        
        <!-- App Container (Constrained Width on Desktop, Unified Style) -->
        <div class="w-full max-w-[440px] min-h-screen text-on-surface antialiased relative flex flex-col">
            
            <!-- Main Content Area -->
            <main class="flex-1 w-full relative z-10 overflow-x-hidden flex flex-col"
                :class="{ 'pt-status-bar': shouldShowStatusBar }">
                <slot />
            </main>

            <!-- Bottom Navigation -->
            <NavigationBar v-if="showNavigationBar" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 判斷是否需要頂部狀態列間距 (排除啟動頁、登入頁與準備頁)
const shouldShowStatusBar = computed(() => {
    return !['index', 'login', 'prepare'].includes(route.name as string);
});

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
