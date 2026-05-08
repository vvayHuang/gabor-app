<template>
    <div class="flex-1 flex flex-col px-4 pb-20 space-y-8 text-on-background overflow-y-auto">
        <ToolbarTop headline="個人資料" type="header">
            <template #right>
                <NuxtLink to="/settings" class="p-2">
                    <Icon name="material-symbols:settings-outline" size="24" class="text-on-background" />
                </NuxtLink>
            </template>
        </ToolbarTop>

        <!-- User Info Section -->
        <div class="flex flex-row items-center gap-6">
            <!-- Avatar with Level Ring -->
            <div class="relative">
                <div class="w-[100px] h-[100px] bg-surface-variant rounded-full overflow-hidden flex-shrink-0 border-4 border-primary/20 p-1">
                    <img :src="user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'" alt="Avatar"
                        class="w-full h-full object-cover rounded-full">
                </div>
                <!-- Level Badge -->
                <div class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[12px] font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                    {{ persistence.currentLevel.value }}
                </div>
            </div>

            <!-- User Text Info -->
            <div class="flex flex-col items-start gap-1">
                <h2 class="title-lg-emphasis text-on-background">{{ user?.user_metadata?.full_name || '視覺觀察員' }}</h2>
                <div class="flex flex-col items-start">
                    <span class="title-sm text-on-surface-variant">Lv.{{ persistence.currentLevel.value }} {{ persistence.rankName.value }}</span>
                    <span class="text-[11px] text-on-surface-variant/60 font-medium uppercase tracking-wider mt-1">
                        已累積 {{ persistence.stats.value.totalXP }} XP
                    </span>
                </div>
            </div>
        </div>

        <!-- Progress Bar Section -->
        <div class="bg-surface-container-low p-5 rounded-3xl space-y-3 border border-on-surface/[0.05]">
            <div class="flex justify-between items-end">
                <span class="label-md text-on-surface-variant">等級進度</span>
                <span class="label-sm text-on-surface-variant/70">{{ Math.round(persistence.levelProgress.value) }}%</span>
            </div>
            <div class="w-full h-3 bg-on-surface/[0.08] rounded-full overflow-hidden">
                <div 
                    class="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                    :style="{ width: persistence.levelProgress.value + '%' }"
                ></div>
            </div>
        </div>

        <!-- Training Stats Grid -->
        <div class="grid grid-cols-3 gap-3">
            <div class="bg-surface-container p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 text-center">
                <span class="text-[20px] font-bold text-primary">{{ persistence.stats.value.currentStreak }}</span>
                <span class="text-[10px] text-on-surface-variant/70 font-medium uppercase">目前連續</span>
            </div>
            <div class="bg-surface-container p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 text-center">
                <span class="text-[20px] font-bold text-primary">{{ persistence.stats.value.totalTimeMinutes }}</span>
                <span class="text-[10px] text-on-surface-variant/70 font-medium uppercase">總訓練(分)</span>
            </div>
            <div class="bg-surface-container p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 text-center">
                <span class="text-[20px] font-bold text-primary">{{ persistence.stats.value.highScore }}</span>
                <span class="text-[10px] text-on-surface-variant/70 font-medium uppercase">最高分</span>
            </div>
        </div>

        <!-- Honor Moments (Achievements) -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="title-md-emphasis text-on-surface-variant">成就紀錄</h3>
                <span class="text-[12px] text-primary font-medium">{{ unlockedCount }} / {{ achievements.length }}</span>
            </div>
            
            <!-- Achievements Container -->
            <div class="grid grid-cols-4 gap-4">
                <div v-for="ach in achievements" :key="ach.id" 
                    class="flex flex-col items-center space-y-2 group cursor-help"
                    :title="ach.description"
                >
                    <div class="relative transition-transform duration-300 group-hover:scale-110">
                        <HonorShape :index="ach.shapeIndex" :class="isUnlocked(ach) ? '' : 'grayscale opacity-30'" />
                        <div v-if="!isUnlocked(ach)" class="absolute inset-0 flex items-center justify-center">
                            <Icon name="material-symbols:lock-outline" size="16" class="text-on-surface/50" />
                        </div>
                    </div>
                    <span class="text-[10px] text-center leading-tight font-medium" :class="isUnlocked(ach) ? 'text-on-surface' : 'text-on-surface-variant/40'">
                        {{ ach.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useGamePersistence } from '~/composables/useGamePersistence';

const persistence = useGamePersistence();
const user = useSupabaseUser();

onMounted(async () => {
    await persistence.loadStats();
});

// 定義成就邏輯
const achievements = [
    { id: 'first_run', name: '初次體驗', shapeIndex: 1, description: '完成第一次訓練', check: (stats: any) => stats.totalXP > 0 },
    { id: 'streak_3', name: '毅力初現', shapeIndex: 2, description: '連續訓練 3 天', check: (stats: any) => stats.consecutiveDays >= 3 },
    { id: 'level_10', name: '中級觀察員', shapeIndex: 3, description: '等級達到 10 級', check: (stats: any) => Math.floor(Math.sqrt(stats.totalXP / 100)) + 1 >= 10 },
    { id: 'pro_trainer', name: '訓練狂人', shapeIndex: 4, description: '累計訓練超過 60 分鐘', check: (stats: any) => stats.totalTimeMinutes >= 60 },
    { id: 'high_scorer', name: '神準之眼', shapeIndex: 5, description: '最高分超過 90 分', check: (stats: any) => stats.highScore >= 90 },
];

const isUnlocked = (ach: any) => {
    return ach.check(persistence.stats.value);
};

const unlockedCount = computed(() => {
    return achievements.filter(isUnlocked).length;
});
</script>

<style scoped>
.animate-in {
    animation-fill-mode: forwards;
}
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes slide-in-from-bottom {
    from { transform: translateY(1rem); }
    to { transform: translateY(0); }
}
.fade-in { animation: fade-in 0.5s ease-out; }
.slide-in-from-bottom-2 { animation: slide-in-from-bottom 0.5s ease-out; }
</style>
