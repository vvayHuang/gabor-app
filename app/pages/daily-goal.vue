<template>
    <div class="flex-1 flex flex-col px-4 relative">
        <!-- Analysis Report View -->
        <div ref="analysisView"
            class="flex-1 flex flex-col items-center justify-between pt-8 space-y-8 opacity-0 translate-y-4">
            <!-- Upper Half: Centered Logo and Title -->
            <div class="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center space-y-6">
                <div class="flex flex-col items-center">
                    <img src="~/assets/logo.svg" alt="Gabor Logo" class="w-24 h-auto animate-bounce-slow" />
                </div>

                <div class="space-y-2">
                    <h1 class="display-sm-emphasis text-on-surface">分析報告</h1>
                    <p class="headline-lg text-on-surface-variant">你做得很好</p>
                </div>
            </div>

            <!-- Lower Half: Unified Metrics Card -->
            <div class="w-full max-w-2xl">
                
                <!-- Unified Card Block -->
                <div class="bg-surface-container-high rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
                    
                    <!-- 3-Column Metrics Layout -->
                    <div class="grid grid-cols-3 gap-2">
                        <!-- Success Rate Stat -->
                        <div class="flex flex-col items-center space-y-1">
                            <div class="flex items-center space-x-1 opacity-60">
                                <Icon name="material-symbols:ads-click" size="16" class="text-primary" />
                                <span class="label-small font-bold uppercase tracking-widest text-on-surface">成功率</span>
                            </div>
                            <div class="flex items-baseline space-x-0.5">
                                <span class="text-2xl font-bold text-on-surface">{{ successRate }}</span>
                                <span class="text-[10px] font-bold text-on-surface-variant">%</span>
                            </div>
                        </div>

                        <!-- Time Elapsed Stat -->
                        <div class="flex flex-col items-center space-y-1 border-l border-outline-variant/20">
                            <div class="flex items-center space-x-1 opacity-60">
                                <Icon name="material-symbols:schedule-outline" size="16" class="text-primary" />
                                <span class="label-small font-bold uppercase tracking-widest text-on-surface">時間</span>
                            </div>
                            <span class="text-2xl font-bold text-on-surface">{{ formattedTime }}</span>
                        </div>

                        <!-- Average Response Stat -->
                        <div class="flex flex-col items-center space-y-1 border-l border-outline-variant/20">
                            <div class="flex items-center space-x-1 opacity-60">
                                <Icon name="material-symbols:avg-pace" size="16" class="text-primary" />
                                <span class="label-small font-bold uppercase tracking-widest text-on-surface">反應</span>
                            </div>
                            <div class="flex items-baseline space-x-0.5">
                                <span class="text-2xl font-bold text-on-surface">{{ avgResponseSpeed }}</span>
                                <span class="text-[10px] font-bold text-on-surface-variant">s</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Button (Bottom Area) -->
                <div class="w-full max-w-md mx-auto pb-[calc(16px+env(safe-area-inset-bottom))] pt-8">
                    <Buttons buttonStyle="Bordered - Prominent" size="Large" label="繼續" to="/streak" />
                </div>
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

const router = useRouter();
const analysisView = ref<HTMLElement | null>(null);

const gameState = useGameState();
const { loadStats } = useGamePersistence();

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

onMounted(async () => {
    await loadStats();
    if (gameState.state.session.totalTime === 0 && gameState.state.session.startTime > 0) {
        gameState.endSession();
    }
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
