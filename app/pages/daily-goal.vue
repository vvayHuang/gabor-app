<template>
    <div class="flex flex-col min-h-screen relative overflow-hidden">
        <!-- Progress Circle View -->
        <div ref="progressView" class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="flex flex-col items-center space-y-6">
                <ProgressCircle :value="80" />
                <h3 class="headline-lg-emphasis text-inverse-on-surface">今日目標達成</h3>
            </div>
        </div>

        <!-- Analysis Report View -->
        <div ref="analysisView" class="absolute inset-0 overflow-y-auto opacity-0">
            <div class="min-h-screen flex flex-col items-center justify-start px-4 py-12">
                <div class="w-full max-w-2xl space-y-6">
                    <!-- Header -->
                    <div class="text-center space-y-1">
                        <p class="label-md-emphasis text-primary uppercase">分析報告</p>
                        <h1 class="display-md-emphasis text-on-background">校準完成</h1>
                    </div>

                    <!-- Metrics Grid -->
                    <div class="grid grid-cols-1 gap-4">
                        <!-- Neural Speed -->
                        <div class="bg-surface-container rounded-2xl p-6">
                            <p class="label-sm text-on-surface-variant uppercase text-center mb-3">神經速度</p>
                            <div class="flex items-baseline justify-center gap-2">
                                <span class="display-sm-emphasis text-on-surface">{{ neuralSpeed }}</span>
                                <span class="body-md text-on-surface-variant">ms</span>
                            </div>
                        </div>

                        <!-- Success Rate -->
                        <div class="bg-surface-container rounded-2xl p-6">
                            <p class="label-sm text-on-surface-variant uppercase text-center mb-3">成功率</p>
                            <div class="flex items-baseline justify-center gap-2">
                                <span class="display-sm-emphasis text-on-surface">{{ successRate }}</span>
                                <span class="body-md text-on-surface-variant">%</span>
                            </div>
                        </div>

                        <!-- Level Attained -->
                        <div class="bg-surface-container rounded-2xl p-6">
                            <p class="label-sm text-on-surface-variant uppercase text-center mb-3">達成等級</p>
                            <div class="flex justify-center">
                                <span class="display-sm-emphasis text-on-surface">{{ levelAttained }}</span>
                            </div>
                        </div>

                        <!-- Sensitivity Index -->
                        <div class="bg-surface-container rounded-2xl p-6">
                            <p class="label-sm text-on-surface-variant uppercase text-center mb-3">敏感度指數</p>
                            <div class="flex justify-center">
                                <span class="display-sm-emphasis text-on-surface">{{ sensitivityIndex }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Diagnostic Verdict -->
                    <div class="bg-surface-container-high rounded-2xl p-6 border-l-4 border-primary">
                        <p class="label-md-emphasis text-on-surface mb-3 uppercase text-center">診斷結果</p>
                        <div class="space-y-2">
                            <p class="body-md text-on-surface-variant text-center">
                                神經訊號：<span class="body-md-emphasis text-primary">穩定_最佳</span>
                            </p>
                            <p class="body-md text-on-surface-variant text-center">
                                補償路徑：<span class="body-md-emphasis text-primary">持續_對比_強化</span>
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col gap-4 pb-8">
                        <GaborButton variant="outline" label="重新校準" @click="recalibrate" class="w-full" />
                        <GaborButton variant="primary" label="繼續" to="/streak" class="w-full" />
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import ProgressCircle from '~/components/ProgressCircle.vue';
import GaborButton from '~/components/GaborButton.vue';

const router = useRouter();
const progressView = ref<HTMLElement | null>(null);
const analysisView = ref<HTMLElement | null>(null);

// Mock data - in real app, this would come from the calibration results
const neuralSpeed = ref(2250);
const successRate = ref(100);
const levelAttained = ref('01');
const sensitivityIndex = ref(3);

const recalibrate = () => {
    // Reset and go back to task grid
    router.push('/task/grid');
};

onMounted(() => {
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
