<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGamePersistence } from '~/composables/useGamePersistence';

const persistence = useGamePersistence();
const showButton = ref(false);

onMounted(() => {
    persistence.loadStats();
    setTimeout(() => {
        showButton.value = true;
    }, 2000); // 稍微縮短等待時間
});

// Date logic
const now = new Date();
const todayDate = `${now.getMonth() + 1}月${now.getDate()}日`;

// Streak Message Logic
const streakMessage = computed(() => {
    const streak = persistence.stats.value.currentStreak;
    const lastPlayed = persistence.stats.value.lastPlayedDate;
    
    if (!lastPlayed) return '開始你的第一次練習！';
    
    const lastDate = new Date(lastPlayed);
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 2) return '好久不見，重新開始練習吧！';
    if (streak > 1) return `你已連續達成 ${streak} 天`;
    return '今天目標已達成！';
});

// Full week cycle
const fullDays = ['日', '一', '二', '三', '四', '五', '六'];

// Generate rolling window of 7 days where the middle (index 3) is always today
const rollingWindow = computed(() => {
    return Array.from({ length: 7 }, (_, i) => {
        // Offset = i - 3 (index 3 is today)
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + (i - 3));
        
        const dateKey = targetDate.toISOString().split('T')[0];
        const dayLabel = fullDays[targetDate.getDay()];
        const hasAchieved = !!persistence.stats.value.achievements[dateKey];
        
        return {
            label: dayLabel,
            active: hasAchieved,
            isToday: i === 3
        };
    });
});
</script>

<template>
    <div class="flex flex-col min-h-safe-content px-4 py-8 text-center bg-background">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center space-y-12">
            <div class="space-y-2">
                <h2 class="headline-sm text-on-background/60">今天，{{ todayDate }}</h2>
                <h1 class="headline-lg text-primary">{{ streakMessage }}</h1>
            </div>

            <!-- Rolling Streak Dots -->
            <div class="flex items-center space-x-5">
                <div v-for="(day, index) in rollingWindow" :key="index" class="relative flex flex-col items-center space-y-2">
                    <!-- Arrow (Always at index 3 because index 3 is Today) -->
                    <Icon v-if="day.isToday" name="material-symbols:arrow-drop-down-rounded" size="32"
                        class="absolute -top-7 text-primary" />
                    <!-- Label -->
                    <span class="body-lg" :class="day.isToday ? 'text-primary font-bold' : 'text-on-background/40'">
                        {{ day.label }}
                    </span>
                    <!-- Dot -->
                    <div class="w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center" :class="[
                        day.active ? 'bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]' : 'bg-surface-variant',
                        day.isToday ? 'scale-110 border-2 border-primary-fixed' : ''
                    ]">
                        <Icon v-if="day.active" name="material-symbols:check-rounded" size="18" class="text-on-primary" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Button (Consistent Bottom Area) -->
        <div class="fixed bottom-0 left-0 w-full p-6 pb-[calc(24px+env(safe-area-inset-bottom))] transition-opacity duration-1000"
            :class="showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <div class="max-w-md mx-auto w-full">
                <Buttons buttonStyle="Bordered - Prominent" size="Large" to="/timer" label="下一步" />
            </div>
        </div>
    </div>
</template>
