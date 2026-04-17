<template>
    <div class="flex flex-col min-h-safe-content px-4 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center space-y-12">
            <div class="space-y-2">
                <h2 class="headline-sm text-inverse-on-surface">今天，{{ todayDate }}</h2>
                <h1 class="headline-lg text-inverse-on-surface">你已連續達成五天</h1>
            </div>

            <!-- Rolling Streak Dots -->
            <div class="flex items-center space-x-6">
                <div v-for="(day, index) in rollingDays" :key="index" class="relative flex flex-col items-center space-y-2">
                    <!-- Arrow (Always at index 3 because index 3 is Today) -->
                    <Icon v-if="index === 3" name="material-symbols:arrow-drop-down-rounded" size="32"
                        class="absolute -top-7 text-inverse-on-surface" />
                    <!-- Label -->
                    <span class="body-lg text-inverse-on-surface">{{ day }}</span>
                    <!-- Dot (Today is index 3, highlight today and the past days shown in this window) -->
                    <div class="w-8 h-8 rounded-full transition-all duration-300" :class="[
                        index <= 3 ? 'bg-inverse-on-surface shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-inverse-on-surface/5',
                        index === 3 ? 'scale-110' : ''
                    ]"></div>
                </div>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="w-full max-w-md mx-auto transition-opacity duration-1000"
            :class="showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <Buttons buttonStyle="Bordered - Prominent" size="Large" to="/timer" label="下一步" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const showButton = ref(false);

// Date logic
const now = new Date();
const todayDate = `${now.getMonth() + 1}月${now.getDate()}日`;

// Full week cycle
const fullDays = ['一', '二', '三', '四', '五', '六', '日'];
const currentDayOfWeekIndex = (now.getDay() + 6) % 7; // Mon=0, ..., Sun=6

// Generate rolling window of 7 days where the middle (index 3) is always today
const rollingDays = computed(() => {
    return Array.from({ length: 7 }, (_, i) => {
        // We want rollingDays[3] to be fullDays[currentDayOfWeekIndex]
        // Offset = currentDayOfWeekIndex - 3
        const index = (currentDayOfWeekIndex - 3 + i + 7) % 7;
        return fullDays[index];
    });
});

onMounted(() => {
    setTimeout(() => {
        showButton.value = true;
    }, 3000);
});
</script>
