<script setup lang="ts">
import { useGamePersistence } from '~/composables/useGamePersistence';

const persistence = useGamePersistence();

// 模擬過去 7 天的準確度趨勢
const trendData = ref([65, 72, 68, 85, 82, 90, 88]);

onMounted(async () => {
    await persistence.loadStats();
});
</script>

<template>
    <div class="flex-1 flex flex-col px-4 space-y-8 pb-6 text-on-background">
        <ToolbarTop headline="紀錄" type="title" />

        <TrendChart :data="trendData" />

        <div class="space-y-4">
            <div class="flex items-end space-x-4">
                <h3 class="display-lg-emphasis text-primary">{{ persistence.stats.value.currentStreak }}</h3>
                <span class="title-lg-emphasis text-primary">連續達成天數</span>
            </div>
            <!-- 使用實例紀錄數據 -->
            <Calendar :achievements="persistence.stats.value.achievements" />
        </div>

        <div class="space-y-4">
            <h3 class="title-md-emphasis text-on-surface-variant">排程</h3>
            <!-- Menu Container -->
            <div class="bg-surface-dim rounded-2xl p-4 flex flex-col gap-[9px] w-full max-w-[370px] mx-auto">
                <!-- Menu Item: Frequency -->
                <div
                    class="flex flex-row items-center justify-between px-2 h-11 cursor-pointer hover:bg-black/5 transition-colors rounded-lg">
                    <div class="flex items-center">
                        <span class="text-base text-on-surface mix-blend-plus-darker">每天</span>
                    </div>
                    <Icon name="material-symbols:chevron-right-rounded" size="20"
                        class="text-on-surface mix-blend-plus-darker" />
                </div>

                <!-- Menu Item: Time -->
                <div
                    class="flex flex-row items-center justify-between px-2 h-11 cursor-pointer hover:bg-black/5 transition-colors rounded-lg">
                    <div class="flex items-center">
                        <span class="text-base text-on-surface mix-blend-plus-darker">下午 5:00</span>
                    </div>
                    <Icon name="material-symbols:chevron-right-rounded" size="20"
                        class="text-on-surface mix-blend-plus-darker" />
                </div>
            </div>
        </div>
    </div>
</template>
