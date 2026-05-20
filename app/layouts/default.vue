<template>
    <!-- Screen Background (Uniform Color) -->
    <div class="min-h-screen bg-surface flex justify-center selection:bg-gray-700 selection:text-white relative overflow-hidden">
        
        <!-- p5.js 生成式幾何流場背景 (僅在支援的客戶端渲染) -->
        <ClientOnly>
            <GaborFlowField />
        </ClientOnly>
        
        <!-- Desktop Navigation Rail (Fixed on the left) -->
        <NavigationRail v-if="showNavigationBar" />

        <!-- App Container (Full Width on Desktop) -->
        <!-- 僅在顯示導覽列時套用 lg:pl-[288px] 避讓左側欄，啟動頁、登入頁與遊戲頁則保持置中 (lg:pl-0) -->
        <div class="w-full max-w-[440px] lg:max-w-none min-h-screen text-on-surface antialiased relative flex flex-col transition-all duration-300"
            :class="[showNavigationBar ? 'lg:pl-[288px]' : 'lg:pl-0']">
            
            <!-- Main Content Area -->
            <main class="flex-1 w-full relative z-10 overflow-x-hidden flex flex-col"
                :class="{ 'pt-status-bar': shouldShowStatusBar }">
                <slot />
            </main>

            <!-- Bottom Navigation (Mobile Only) -->
            <NavigationBar v-if="showNavigationBar" class="lg:hidden" />
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
