<script setup lang="ts">
const mainItems = [
    { to: '/prepare', icon: 'material-symbols:public', label: '首頁' },
    { to: '/records', icon: 'material-symbols:schedule-outline-rounded', label: '紀錄' },
    { to: '/profile', icon: 'material-symbols:contacts-product', label: '個人' },
    { to: '/tutorial', icon: 'material-symbols:question-mark', label: '說明' },
];
</script>

<template>
    <nav class="fixed left-8 top-1/2 -translate-y-1/2 z-50 py-8 hidden lg:flex flex-col items-center">
        <LiquidGlass rounded="full" :border="false" class="py-4">
            <div class="flex flex-col items-center space-y-4 px-2">
                <NavigationItem 
                    v-for="item in mainItems" 
                    :key="item.to" 
                    v-bind="item" 
                    class="!flex-row !justify-start !w-32 !h-14 !gap-4 !px-4"
                />
            </div>
        </LiquidGlass>
    </nav>
</template>

<style scoped>
/* 覆蓋 NavigationItem 的垂直佈局，在側邊欄使用水平佈局 */
:deep(.nav-item) {
    flex-direction: row !important;
    justify-content: flex-start !important;
    width: 140px !important;
    height: 56px !important;
    gap: 12px !important;
    padding: 0 16px !important;
    border-radius: 16px !important;
}

:deep(.nav-label) {
    text-align: left !important;
    font-size: 14px !important;
    line-height: 20px !important;
    width: auto !important;
    height: auto !important;
    mix-blend-mode: normal !important;
}

:deep(.selection-bg) {
    border-radius: 16px !important;
}
</style>
