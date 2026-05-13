<script setup lang="ts">
import { useGamePersistence } from '~/composables/useGamePersistence';
import { onMounted } from 'vue';

const persistence = useGamePersistence();

onMounted(async () => {
    await persistence.loadStats();
});
</script>

<template>
    <div class="flex-1 flex flex-col px-4 space-y-10 pb-32 text-on-background overflow-y-auto">
        <ToolbarTop headline="紀錄" type="title" />

        <!-- 1. Current Streak (Large Text) -->
        <div class="space-y-2">
            <div class="flex items-end space-x-4">
                <h3 class="display-lg-emphasis text-primary">{{ persistence.stats.value.currentStreak }}</h3>
                <span class="title-lg-emphasis text-primary">連續達成天數</span>
            </div>
        </div>

        <!-- 2. Activity Calendar -->
        <div class="space-y-4">
            <Calendar :achievements="persistence.stats.value.achievements" />
        </div>

        <!-- 3. Training Stats Overview (Including Progress Bar) -->
        <div class="space-y-6">
            <h3 class="title-md-emphasis text-on-surface-variant">訓練統計</h3>

            <div class="grid grid-cols-2 gap-y-6 gap-x-8">
                <!-- Total Sessions -->
                <div class="flex flex-col">
                    <span class="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-1">總訓練次數</span>
                    <span class="title-lg-emphasis text-on-surface">{{ persistence.stats.value.totalSessions }} <span
                            class="label-sm">次</span></span>
                </div>
                <!-- High Score -->
                <div class="flex flex-col border-l border-outline-variant/30 pl-6">
                    <span class="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-1">歷史最高分</span>
                    <span class="title-lg-emphasis text-on-surface">{{ persistence.stats.value.highScore }} <span
                            class="label-sm">分</span></span>
                </div>
                <!-- Total Training Time -->
                <div class="flex flex-col">
                    <span class="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-1">累計時長</span>
                    <span class="title-lg-emphasis text-on-surface">{{
                        Math.round(persistence.stats.value.totalTimeMinutes || 0) }} <span
                            class="label-sm">分鐘</span></span>
                </div>

                <!-- Integrated Progress Bar -->
                <div class="col-span-2 flex flex-col pt-2">
                    <span
                        class="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-2.5">升級進度</span>
                    <div class="flex items-center space-x-4">
                        <div class="flex-1 h-2 bg-on-surface/[0.08] rounded-full overflow-hidden">
                            <div class="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                                :style="{ width: persistence.levelProgress.value + '%' }"></div>
                        </div>
                        <span class="label-md text-on-surface font-bold">{{ Math.round(persistence.levelProgress.value)
                            }}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
