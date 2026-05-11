<script setup lang="ts">
import { useGamePersistence } from '~/composables/useGamePersistence';

const persistence = useGamePersistence();

// 將近期紀錄轉換為「每日平均正確率」趨勢圖 (顯示過去 7 天)
const trendData = computed(() => {
    const sessions = persistence.stats.value.recentSessions || [];
    if (sessions.length === 0) return [0, 0, 0, 0, 0, 0, 0];

    // 1. 按日期分組計算總和與次數
    const dailyMap = new Map<string, { total: number, count: number }>();
    
    sessions.forEach(s => {
        if (!s.created_at) return;
        const dateKey = new Date(s.created_at).toLocaleDateString('zh-TW');
        const current = dailyMap.get(dateKey) || { total: 0, count: 0 };
        dailyMap.set(dateKey, {
            total: current.total + s.accuracy,
            count: current.count + 1
        });
    });

    // 2. 產出過去 7 天的數列
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString('zh-TW');
        const data = dailyMap.get(dateKey);
        
        if (data) {
            result.push(Math.round(data.total / data.count));
        } else {
            result.push(0); // 當天無紀錄則為 0
        }
    }
    
    return result;
});

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
