<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-8 text-center relative overflow-hidden">
        <!-- Completion Ring -->
        <div class="mb-8 relative">
            <ProgressCircle :value="100" :size="200" :stroke-width="12" />
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-6xl font-bold text-primary">100%</div>
                <div class="text-sm text-on-surface-variant mt-2">今日目標達成</div>
            </div>
        </div>

        <!-- Rest Timer -->
        <div class="mb-12 space-y-2">
            <h2 class="text-3xl font-light text-inverse-on-surface">休息時間</h2>
            <p class="text-on-surface-variant">閉上眼睛，放鬆 {{ remainingSeconds }} 秒</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-6 mb-12 max-w-md w-full">
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ stats.correctCount }}</div>
                <div class="text-xs text-on-surface-variant">正確</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ accuracy.toFixed(0) }}%</div>
                <div class="text-xs text-on-surface-variant">準確率</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ avgTime.toFixed(0) }}ms</div>
                <div class="text-xs text-on-surface-variant">平均反應</div>
            </div>
        </div>

        <!-- Continue Button (appears after countdown) -->
        <GaborButton 
            v-if="remainingSeconds === 0"
            variant="primary" 
            label="繼續訓練" 
            @click="continueGame" />

        <!-- Wave Animation Background -->
        <div class="fixed inset-0 -z-10 opacity-20 pointer-events-none">
            <div ref="waveContainer" class="w-full h-full blur-xl"></div>
        </div>

        <!-- Background Noise -->
        <div class="fixed inset-0 -z-20 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameState } from '~/composables/useGameState';
import GaborButton from '~/components/GaborButton.vue';
import ProgressCircle from '~/components/ProgressCircle.vue';

const router = useRouter();
const gameState = useGameState();
const waveContainer = ref<HTMLElement | null>(null);
const remainingSeconds = ref(30);

// Compute stats from game state
const stats = computed(() => gameState.state.session);
const accuracy = computed(() => gameState.accuracy.value);
const avgTime = computed(() => gameState.averageResponseTime.value);

// Countdown timer
let countdownInterval: NodeJS.Timeout | null = null;

onMounted(() => {
    // Start countdown
    countdownInterval = setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value--;
        } else if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    // Simple wave animation using CSS
    if (waveContainer.value) {
        waveContainer.value.innerHTML = `
            <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/30 to-transparent animate-wave"></div>
            <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/20 to-transparent animate-wave-delayed"></div>
        `;
    }
});

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

const continueGame = () => {
    router.push('/task/grid?phase=3x3');
};
</script>

<style scoped>
@keyframes wave {
    0%, 100% {
        transform: translateY(0) scaleY(1);
    }
    50% {
        transform: translateY(-20px) scaleY(1.1);
    }
}

@keyframes wave-delayed {
    0%, 100% {
        transform: translateY(0) scaleY(1);
    }
    50% {
        transform: translateY(-15px) scaleY(1.05);
    }
}

.animate-wave {
    animation: wave 4s ease-in-out infinite;
}

.animate-wave-delayed {
    animation: wave-delayed 5s ease-in-out infinite;
    animation-delay: 1s;
}
</style>
