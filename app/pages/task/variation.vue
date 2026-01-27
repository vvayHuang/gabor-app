<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 relative transition-colors duration-100"
        :class="{ 'bg-error/20': feedbackState === 'ERROR' }">
        <!-- Header -->
        <div class="fixed top-[62px] left-0 w-full px-4 flex justify-between items-center z-20 gap-12">
            <!-- Exit Button -->
            <IconButton icon="material-symbols:close" size="medium"
                class="hover:bg-white/10 text-inverse-on-surface hover:text-white" @click="handleExit" />

            <!-- Progress Bar -->
            <TaskProgress :current="currentLevel" :total="totalLevels" width="100%" class="flex-1" />
        </div>

        <!-- Exit Confirmation Dialog -->
        <div v-if="showExitConfirmation"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm mb-0">
            <div
                class="bg-surface-container-high p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-outline-variant">
                <h3 class="text-xl font-bold text-on-surface mb-2">確定要離開嗎？</h3>
                <p class="text-on-surface-variant mb-6">您的進度將會遺失。</p>
                <div class="flex justify-end space-x-3">
                    <button
                        class="px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-lg transition"
                        @click="cancelExit">
                        取消
                    </button>
                    <button
                        class="px-4 py-2 bg-error text-on-error hover:bg-error-container hover:text-on-error-container rounded-lg transition font-medium"
                        @click="confirmExit">
                        離開
                    </button>
                </div>
            </div>
        </div>

        <!-- Grid -->
        <div v-if="gameStarted"
            class="grid gap-2 w-full max-w-sm aspect-square transition-transform duration-100 animate-fade-in-up grid-cols-4"
            :class="[
                feedbackState === 'ERROR' ? 'animate-shake' : ''
            ]">
            <div v-for="(item, index) in gridItems" :key="`variation-${index}`"
                class="relative group flex items-center justify-center cursor-pointer" @click="handleInteraction(index)"
                :class="{ 'pointer-events-none': feedbackState !== 'IDLE' }">

                <div
                    class="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 transition-colors pointer-events-none z-10">
                </div>

                <!-- Feedback Overlay (Invert) -->
                <div class="absolute inset-0 bg-white mix-blend-difference pointer-events-none z-30 transition-opacity duration-75"
                    :class="(feedbackState === 'SUCCESS' && selectedIndex === index) ? 'opacity-100' : 'opacity-0'">
                </div>

                <ClientOnly>
                    <GaborCanvas :ref="el => { if (el) canvasRefs[index] = el }" :size="80" :params="item"
                        :primary-color="primaryColor" :secondary-color="secondaryColor" />
                </ClientOnly>
            </div>
        </div>

        <div v-if="!gameStarted" class="text-white">Loading variation...</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useGameState } from '~/composables/useGameState';

import GaborCanvas from '~/components/GaborCanvas.vue';
import TaskProgress from '~/components/TaskProgress.vue';
import IconButton from '~/components/IconButton.vue';

const router = useRouter();
const gameState = useGameState();

type FeedbackState = 'IDLE' | 'SUCCESS' | 'ERROR';

const currentLevel = ref(1);
const totalLevels = 5;
const gameStarted = ref(false);
const feedbackState = ref<FeedbackState>('IDLE');
const selectedIndex = ref(-1);
const canvasRefs = ref<any[]>([]);
const gridItems = ref<any[]>([]);
const targetIndex = ref(0);

const primaryColor = ref('#FFFFFF');
const secondaryColor = ref('#000000');
const baseSigma = 30;

const startLevel = () => {
    feedbackState.value = 'IDLE';
    selectedIndex.value = -1;

    const count = 16; // 4x4 grid
    targetIndex.value = Math.floor(Math.random() * count);

    const baseAngle = Math.random() * 30; // Small angle range for harder difficulty
    const targetAngle = (baseAngle + (10 + Math.random() * 10)) % 360;

    gridItems.value = Array.from({ length: count }, (_, i) => {
        const isTarget = i === targetIndex.value;
        const phase = Math.random() * Math.PI * 2;
        return {
            orientation: isTarget ? targetAngle : baseAngle,
            frequency: 0.05 + Math.random() * 0.02,
            contrast: 0.8,
            sigma: baseSigma,
            phase: phase,
        };
    });
};

const handleInteraction = (index: number) => {
    if (feedbackState.value !== 'IDLE') return;

    selectedIndex.value = index;
    const isCorrect = index === targetIndex.value;

    if (isCorrect) {
        const canvas = canvasRefs.value[index];
        if (canvas && canvas.triggerInvert) {
            canvas.triggerInvert();
        }
        feedbackState.value = 'SUCCESS';

        setTimeout(() => {
            currentLevel.value++;
            if (currentLevel.value > totalLevels) {
                router.push('/daily-goal');
            } else {
                startLevel();
            }
        }, 500);
    } else {
        feedbackState.value = 'ERROR';
        setTimeout(() => {
            feedbackState.value = 'IDLE';
            selectedIndex.value = -1;
        }, 500);
    }
};

const showExitConfirmation = ref(false);
const handleExit = () => showExitConfirmation.value = true;
const cancelExit = () => showExitConfirmation.value = false;
const confirmExit = () => router.push('/task/grid');

onMounted(() => {
    gameStarted.value = true;
    startLevel();
});
</script>

<style scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-2px);
    }

    75% {
        transform: translateX(2px);
    }
}

.animate-shake {
    animation: shake 0.2s ease-in-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}
</style>
