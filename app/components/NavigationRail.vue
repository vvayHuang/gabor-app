<script setup lang="ts">
const items = [
    { to: '/prepare', icon: 'material-symbols:public', label: '首頁' },
    { to: '/records', icon: 'material-symbols:schedule-outline-rounded', label: '紀錄' },
    { to: '/profile', icon: 'material-symbols:contacts-product', label: '個人' },
    { to: '/tutorial', icon: 'material-symbols:question-mark', label: '說明' },
];
</script>

<template>
    <nav class="fixed left-8 top-8 bottom-8 z-50 w-56 hidden lg:flex flex-col">
        <!-- 採用 3xl 圓角做為懸浮玻璃外框 -->
        <LiquidGlass rounded="3xl" :border="false" class="h-full w-full">
            <div class="flex flex-col items-center h-full py-8 w-full">
                <!-- 頂部 Logo 與標題 -->
                <div class="w-full px-6 mb-8 flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                        G
                    </div>
                    <span class="font-bold text-on-surface text-base tracking-wide">Gabor Patch</span>
                </div>

                <!-- 導覽項目群組：參考 Apple Music 風格，橫向 icon + 文字排列 -->
                <div class="flex-1 flex flex-col w-full px-3 space-y-1.5">
                    <NavigationItem 
                        v-for="item in items" 
                        :key="item.to" 
                        v-bind="item" 
                    />
                </div>
            </div>
        </LiquidGlass>
    </nav>
</template>

<style scoped>
/* 深度覆蓋導覽項目，改為橫向排列 (Icon + 文字)，高 40px，圓角 8px (比照 Apple Music) */
:deep(.nav-item) {
    flex-direction: row !important;
    justify-content: flex-start !important;
    width: 100% !important;
    height: 40px !important;
    gap: 12px !important;
    padding: 0 12px !important;
    border-radius: 8px !important;
}

/* 確保 Icon 在橫向 Flex 容器中不會被擠壓或縮小 */
:deep(.nav-icon) {
    flex-shrink: 0 !important;
}

/* 微調文字樣式，靠左對齊，尺寸 14px */
:deep(.nav-label) {
    text-align: left !important;
    font-size: 14px !important;
    line-height: 20px !important;
    width: auto !important;
    height: auto !important;
    font-weight: 500 !important;
    mix-blend-mode: normal !important;
}

/* 讓 Active 選取背景的圓角同樣對齊為 8px */
:deep(.selection-bg) {
    border-radius: 8px !important;
}
</style>


