<template>
    <div class="flex-1 flex flex-col px-4 relative">
        <!-- Analysis Report View -->
        <div ref="analysisView"
            class="flex-1 flex flex-col items-center justify-between pt-8 space-y-8 opacity-0 translate-y-4">
            <!-- Upper Half: Centered Logo, Title, and Metrics Layout -->
            <div class="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center space-y-12">
                <div class="flex flex-col items-center space-y-6">
                    <div class="flex flex-col items-center">
                        <Logo class="w-24 h-auto animate-bounce-slow text-on-surface" />
                    </div>

                    <div class="space-y-2">
                        <h1 class="display-sm-emphasis text-on-surface">分析報告</h1>
                        <p class="headline-lg text-on-surface-variant">{{ feedbackText }}</p>
                    </div>
                </div>

                <!-- 3-Column Metrics Layout (Minimalist Style) -->
                <div class="w-full px-1 sm:px-6">
                    <div class="grid grid-cols-3 gap-2 sm:gap-4">
                        <!-- Success Rate Stat -->
                        <div class="flex flex-col items-start space-y-1">
                            <span class="label-sm font-bold uppercase tracking-widest text-on-surface-variant">成功率</span>
                            <div class="flex items-baseline space-x-1">
                                <span class="display-sm-emphasis text-on-surface">{{ successRate }}</span>
                                <span class="label-sm font-bold text-on-surface-variant">%</span>
                            </div>
                        </div>

                        <!-- Time Elapsed Stat -->
                        <div class="flex flex-col items-start space-y-1 border-l border-outline-variant/30 pl-3 sm:pl-6">
                            <span class="label-sm font-bold uppercase tracking-widest text-on-surface-variant">訓練時間</span>
                            <span class="display-sm-emphasis text-on-surface">{{ formattedTime }}</span>
                        </div>

                        <!-- Average Response Stat -->
                        <div class="flex flex-col items-start space-y-1 border-l border-outline-variant/30 pl-3 sm:pl-6">
                            <span class="label-sm font-bold uppercase tracking-widest text-on-surface-variant">平均反應</span>
                            <div class="flex items-baseline space-x-1">
                                <span class="display-sm-emphasis text-on-surface">{{ avgResponseSpeed }}</span>
                                <span class="label-sm font-bold text-on-surface-variant">s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Button (Bottom Area) -->
            <div class="w-full max-w-md md:max-w-2xl mx-auto px-0 md:px-6 pb-[calc(16px+env(safe-area-inset-bottom))] pt-16">
                <Buttons buttonStyle="Bordered - Prominent" size="Large" label="繼續" to="/streak" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { useGameState } from '~/composables/useGameState';
import { useGamePersistence } from '~/composables/useGamePersistence';
import { useAudio } from '~/composables/useAudio';

const router = useRouter();
const analysisView = ref<HTMLElement | null>(null);

const gameState = useGameState();
const { loadStats } = useGamePersistence();
const { playSound } = useAudio();

const elapsedSeconds = computed(() => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const totalTime = gameState.state.session.totalTime;
    if (totalTime <= 0 || totalTime > oneDayInMs) return 323;
    return Math.floor(totalTime / 1000);
});

const successRate = computed(() => Math.round(gameState.accuracy.value));

const avgResponseSpeed = computed(() => {
    const ms = gameState.averageResponseTime.value;
    return (ms / 1000).toFixed(2);
});

const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedSeconds.value / 60);
    const seconds = elapsedSeconds.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const feedbackText = computed(() => {
    const rate = successRate.value;
    if (rate >= 95) {
        return '眼力極佳！你眼睛好利！';
    } else if (rate >= 85) {
        return '做得真棒！優秀的視覺敏銳度！';
    } else if (rate >= 70) {
        return '穩步提升中，繼續加油！';
    } else {
        return '熱身完畢！再接再厲，下次會更好！';
    }
});

onMounted(async () => {
    await loadStats();
    if (gameState.state.session.totalTime === 0 && gameState.state.session.startTime > 0) {
        gameState.endSession();
    }
    playSound('complete');
    gsap.to(analysisView.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
    });
});
</script>

<style scoped>
.animate-bounce-slow { animation: bounce 3s infinite; }
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
</style>
