<script setup lang="ts">
const mainItems = [
    { to: '/prepare', icon: 'material-symbols:public', label: '首頁' },
    { to: '/records', icon: 'material-symbols:schedule-outline-rounded', label: '紀錄' },
    { to: '/profile', icon: 'material-symbols:contacts-product', label: '個人' },
];

const sideItem = { to: '/tutorial', icon: 'material-symbols:question-mark', label: '說明' };
</script>

<template>
    <div class="fixed bottom-8 left-0 right-0 w-full z-50 px-6 flex justify-between items-center pointer-events-none">

        <!-- 左側群組 -->
        <div class="pointer-events-auto h-[58px]">
            <LiquidGlass rounded="full" :border="false" class="h-full">
                <div class="flex items-center h-full px-1 -space-x-[10px]">
                    <NavigationItem v-for="item in mainItems" :key="item.to" v-bind="item" />
                </div>
            </LiquidGlass>
        </div>

        <!-- 右側獨立項目 -->
        <div class="pointer-events-auto h-[58px] w-[58px]">
            <LiquidGlass rounded="full" :border="false" class="h-full w-full">
                <div class="flex items-center justify-center h-full">
                    <NavigationItem v-bind="sideItem" size="small" :show-label="false" />
                </div>
            </LiquidGlass>
        </div>

    </div>
</template>
