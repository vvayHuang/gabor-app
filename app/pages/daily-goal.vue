<template>
    <div class="flex flex-col min-h-safe-content relative overflow-hidden">
        <!-- TimeSphere View -->
        <div ref="progressView" class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="flex flex-col items-center space-y-12">
                <TimeSphere :elapsedSeconds="elapsedSeconds" />
                <h3 class="headline-lg-emphasis text-inverse-on-surface">今日目標達成</h3>
            </div>
        </div>

        <!-- Analysis Report View -->
        <div ref="analysisView" class="absolute inset-0 overflow-y-auto opacity-0 bg-surface">
            <div class="min-h-safe-content flex flex-col items-center justify-between px-4 py-16">
                <!-- Upper Half: Centered Logo and Title -->
                <div class="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center space-y-6">
                    <img src="~/assets/logo.svg" alt="Gabor Logo" class="w-24 h-auto" />
                    <div class="space-y-2">
                        <h1 class="display-sm-emphasis text-on-surface">分析報告</h1>
                        <p class="headline-lg text-on-surface-variant">你做得很好</p>
                    </div>
                </div>

                <!-- Lower Half: Metrics and Continue Button -->
                <div class="w-full max-w-2xl space-y-4">
                    <!-- Metrics Grid -->
                    <div class="grid grid-cols-3 gap-3">
                        <!-- Success Rate -->
                        <div class="bg-primary-container flex flex-col overflow-hidden p-1 rounded-2xl shadow-sm">
                            <div class="p-2 flex items-center justify-center space-x-1">
                                <Icon name="material-symbols:celebration-outline" size="16" class="text-white" />
                                <span class="text-[10px] font-bold text-white uppercase tracking-wider">成功率</span>
                            </div>
                            <div
                                class="bg-surface flex flex-1 flex-col items-center justify-center min-h-[80px] p-4 rounded-2xl">
                                <div class="flex items-baseline space-x-1">
                                    <span class="text-2xl font-bold text-on-surface">{{ successRate }}</span>
                                    <span class="text-xs text-on-surface-variant">%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Level Attained -->
                        <div class="bg-secondary-container flex flex-col overflow-hidden p-1 rounded-2xl shadow-sm">
                            <div class="p-2 flex items-center justify-center space-x-1">
                                <Icon name="material-symbols:celebration-outline" size="16"
                                    class="text-on-secondary-fixed-variant" />
                                <span
                                    class="text-[10px] font-bold text-on-secondary-fixed-variant uppercase tracking-wider">達成等級</span>
                            </div>
                            <div
                                class="bg-surface flex flex-1 flex-col items-center justify-center min-h-[80px] p-4 rounded-2xl">
                                <span class="text-2xl font-bold text-on-surface">{{ levelAttained }}</span>
                            </div>
                        </div>

                        <!-- Time Elapsed -->
                        <div class="bg-tertiary-container flex flex-col overflow-hidden p-1 rounded-2xl shadow-sm">
                            <div class="p-2 flex items-center justify-center space-x-1">
                                <Icon name="material-symbols:celebration-outline" size="16" class="text-white" />
                                <span class="text-[10px] font-bold text-white uppercase tracking-wider">花費時間</span>
                            </div>
                            <div
                                class="bg-surface flex flex-1 flex-col items-center justify-center min-h-[80px] p-4 rounded-2xl">
                                <span class="text-2xl font-bold text-on-surface">{{ formattedTime }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="flex flex-col">
                        <Buttons buttonStyle="bordered-prominent" label="繼續" to="/streak" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Background Noise -->
        <div class="fixed inset-0 -z-10 opacity-[0.02] pointer-events-none">
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';


import { useGameState } from '~/composables/useGameState';

const router = useRouter();
const progressView = ref<HTMLElement | null>(null);
const analysisView = ref<HTMLElement | null>(null);

// Get game state to access session time
const gameState = useGameState();

// Convert totalTime from milliseconds to seconds (with safety check)
const elapsedSeconds = computed(() => {
    // If totalTime is abnormally large (e.g. over 24 hours), it's likely a calculation error from startTime=0
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const totalTime = gameState.state.session.totalTime;

    if (totalTime <= 0 || totalTime > oneDayInMs) {
        return 323; // Fallback to demo value if invalid
    }
    return Math.floor(totalTime / 1000);
});

// Derive metrics from actual session data
const successRate = computed(() => Math.round(gameState.accuracy.value));
const levelAttained = computed(() => gameState.state.session.currentLevel.toString().padStart(1, '0'));

// Format time as M:SS
const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedSeconds.value / 60);
    const seconds = elapsedSeconds.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
    // End session just in case it wasn't ended properly
    if (gameState.state.session.totalTime === 0 && gameState.state.session.startTime > 0) {
        gameState.endSession();
    }

    // Wait 3 seconds, then fade out progress view and fade in analysis view
    gsap.timeline()
        .to(progressView.value, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 3
        })
        .to(analysisView.value, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.4'); // Overlap animations by 0.4s
});
</script>
