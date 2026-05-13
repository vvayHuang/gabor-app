<template>
    <div class="flex-1 flex flex-col px-4 pb-32 space-y-10 text-on-background overflow-y-auto">
        <ToolbarTop headline="個人資料" type="header">
            <template #right>
                <NuxtLink to="/settings" class="p-2">
                    <Icon name="material-symbols:settings-outline" size="24" class="text-on-background" />
                </NuxtLink>
            </template>
        </ToolbarTop>

        <!-- User Info Section -->
        <div class="flex flex-row items-center gap-6">
            <!-- Simple Avatar -->
            <div class="relative">
                <div
                    class="w-[88px] h-[88px] bg-surface-variant rounded-full overflow-hidden flex-shrink-0 border-2 border-on-surface/[0.05] p-1">
                    <img :src="user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'"
                        alt="Avatar" class="w-full h-full object-cover rounded-full">
                </div>
            </div>

            <!-- User Name & Status -->
            <div class="flex flex-col items-start gap-1">
                <h2 class="title-lg-emphasis text-on-background">{{ user?.user_metadata?.full_name || '使用者' }}</h2>
                <span class="label-sm text-on-surface-variant font-medium">
                    <template v-if="joinedDate">{{ joinedDate }} 加入</template>
                    <template v-else>&nbsp;</template>
                </span>
            </div>
        </div>

        <!-- Unified Overview Section -->
        <div class="space-y-6">
            <h3 class="title-md-emphasis text-on-surface-variant">概覽</h3>

            <div class="space-y-6">
                <!-- Data List (Simplified: Level & XP only) -->
                <div class="grid grid-cols-2 gap-y-6 gap-x-8">
                    <!-- Current Level -->
                    <div class="flex flex-col">
                        <span
                            class="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-1">目前等級</span>
                        <span class="title-lg-emphasis text-on-surface">Lv.{{ persistence.currentLevel.value }}</span>
                    </div>
                    <!-- Total XP -->
                    <div class="flex flex-col border-l border-outline-variant/30 pl-6">
                        <span
                            class="label-sm text-on-surface-variant font-bold uppercase tracking-widest mb-1">累積經驗</span>
                        <span class="title-lg-emphasis text-on-surface">{{ persistence.stats.value.totalXP }} <span
                                class="label-sm">XP</span></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Honor Moments (Achievements) -->
        <div class="space-y-4 pb-8">
            <h3 class="title-md-emphasis text-on-surface-variant">成就紀錄</h3>


            <div class="grid grid-cols-4 gap-4">
                <div v-for="ach in achievements" :key="ach.id"
                    class="flex flex-col items-center space-y-2 group cursor-help" :title="ach.description">
                    <div class="relative transition-transform duration-300 group-hover:scale-110">
                        <HonorShape :index="ach.shapeIndex" :class="isUnlocked(ach) ? '' : 'grayscale opacity-30'" />
                        <div v-if="!isUnlocked(ach)" class="absolute inset-0 flex items-center justify-center">
                            <Icon name="material-symbols:lock-outline" size="16" class="text-on-surface/50" />
                        </div>
                    </div>
                    <span class="label-sm text-center leading-tight font-medium"
                        :class="isUnlocked(ach) ? 'text-on-surface' : 'text-on-surface-variant'">
                        {{ ach.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useGamePersistence } from '~/composables/useGamePersistence';

const persistence = useGamePersistence();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const manualDate = ref<string | null>(null);

const joinedDate = computed(() => {
    const rawDate = manualDate.value || user.value?.created_at;
    if (!rawDate) return null;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return null;

    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
});

// 定義成就邏輯
const achievements = [
    { id: 'first_run', name: '初次體驗', shapeIndex: 1, description: '完成第一次訓練', check: (stats: any) => stats.totalXP > 0 },
    { id: 'streak_3', name: '毅力初現', shapeIndex: 2, description: '連續訓練 3 天', check: (stats: any) => stats.consecutiveDays >= 3 },
    { id: 'level_10', name: '中級觀察員', shapeIndex: 3, description: '等級達到 10 級', check: (stats: any) => Math.floor(Math.sqrt(stats.totalXP / 100)) + 1 >= 10 },
    { id: 'pro_trainer', name: '訓練狂人', shapeIndex: 4, description: '累計訓練超過 60 分鐘', check: (stats: any) => stats.totalTimeMinutes >= 60 },
    { id: 'high_scorer', name: '神準之眼', shapeIndex: 5, description: '歷史最高分超過 5000', check: (stats: any) => stats.highScore >= 5000 },
];

const isUnlocked = (ach: any) => {
    return ach.check(persistence.stats.value);
};

const unlockedCount = computed(() => {
    return achievements.filter(isUnlocked).length;
});

onMounted(() => {
    // 使用並行執行 (Parallel)，確保統計數據與使用者資訊同時開始抓取
    Promise.all([
        persistence.loadStats(),
        supabase.auth.getUser().then(({ data }) => {
            if (data.user?.created_at) {
                manualDate.value = data.user.created_at;
            }
        })
    ]).catch(e => console.error('Data loading failed:', e));
});
</script>

<style scoped>
</style>
