<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 relative">
        <!-- Header -->
        <div class="fixed top-[62px] left-0 w-full px-4 flex justify-between items-center z-20 gap-12">
            <!-- Exit Button -->
            <IconButton icon="material-symbols:close" size="medium"
                class="hover:bg-white/10 text-inverse-on-surface hover:text-white" @click="handleExit" />

            <!-- Progress Bar -->
            <TaskProgress :current="currentLevelInPhase" :total="levelsPerPhase" width="100%" class="flex-1" />
        </div>

        <!-- Exit Confirmation Dialog -->
        <div v-if="showExitConfirmation"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
        <div v-if="gameStarted" class="grid gap-4 w-full max-w-sm aspect-square transition-transform duration-100"
            :class="[
                gridSize === 2 ? 'grid-cols-2' : 'grid-cols-3',
                feedbackState === 'ERROR' ? 'animate-shake' : ''
            ]">
            <div v-for="(item, index) in gridItems" :key="`level-${globalLevel}-${index}`"
                class="relative group flex items-center justify-center cursor-pointer" @click="handleInteraction(index)"
                :class="{ 'pointer-events-none': feedbackState !== 'IDLE' }">
                <!-- Active state style on hover/active handled mainly by JS logic in real app, but CSS hover here -->
                <div
                    class="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 transition-colors pointer-events-none z-10">
                </div>

                <!-- Feedback Overlay (Invert) -->
                <div class="absolute inset-0 bg-white mix-blend-difference pointer-events-none z-30 transition-opacity duration-75"
                    :class="(feedbackState === 'SUCCESS' && selectedIndex === index) ? 'opacity-100' : 'opacity-0'">
                </div>

                <ClientOnly>
                    <GaborCanvas :size="gridSize === 2 ? 172 : 110" :params="item" />
                </ClientOnly>
            </div>
        </div>
        <div v-else class="text-white">Loading game...</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

import GaborCanvas from '~/components/GaborCanvas.vue';
import TaskProgress from '~/components/TaskProgress.vue';
import IconButton from '~/components/IconButton.vue';

const router = useRouter();
const route = useRoute();

// --- Game State ---
type GamePhase = '2x2_LEVELS' | '3x3_LEVELS' | 'GAME_OVER';
type FeedbackState = 'IDLE' | 'SUCCESS' | 'ERROR';

const gamePhase = ref<GamePhase>('2x2_LEVELS');
const currentLevelInPhase = ref(1);
const globalLevel = ref(1);
const levelsPerPhase = 5;
const gridSize = ref(2); // Initial grid size
const gameStarted = ref(false);

const feedbackState = ref<FeedbackState>('IDLE');
const selectedIndex = ref(-1);

// --- Gabor Generation State ---
const gridItems = ref<any[]>([]);
const targetIndex = ref(0);
const baseContrast = 1.0; // Fixed for now, can be adaptive later
const baseSigma = 40; // Fixed for now
const baseFrequencyRange = { min: 0.02, max: 0.08 };

// --- Methods ---

const startNewGame = () => {
    gamePhase.value = '2x2_LEVELS';
    currentLevelInPhase.value = 1;
    globalLevel.value = 1;
    gridSize.value = 2;
    gameStarted.value = true;
    generateLevel();
};

const generateLevel = () => {
    feedbackState.value = 'IDLE'; // Reset feedback state
    selectedIndex.value = -1; // Reset selected index

    const count = gridSize.value * gridSize.value;
    targetIndex.value = Math.floor(Math.random() * count);

    // Difficulty Algorithm: difficultyOffset decreases as globalLevel increases
    // minOffset for 2x2: e.g., 10 degrees. for 3x3: e.g., 8 degrees
    const minOffset = gridSize.value === 2 ? 10 : 8; // Example minOffset
    // Decrease offset by 2 degrees for every 2 global levels, up to a certain point
    const difficultyOffset = Math.max(minOffset, 45 - Math.floor(globalLevel.value / 2) * 2);

    const baseAngle = Math.random() * 360; // Random base angle
    const targetAngle = (baseAngle + difficultyOffset) % 360;

    gridItems.value = Array.from({ length: count }, (_, i) => {
        const isTarget = i === targetIndex.value;
        const phase = Math.random() * Math.PI * 2; // Random phase for every patch
        const frequency = baseFrequencyRange.min + Math.random() * (baseFrequencyRange.max - baseFrequencyRange.min); // Random frequency

        return {
            orientation: isTarget ? targetAngle : baseAngle,
            frequency: frequency,
            contrast: baseContrast,
            sigma: baseSigma,
            phase: phase,
        };
    });
};

const handleInteraction = (index: number) => {
    if (feedbackState.value !== 'IDLE') return; // Prevent multiple clicks during feedback

    selectedIndex.value = index;

    if (index === targetIndex.value) {
        // Correct guess
        feedbackState.value = 'SUCCESS';

        // Use a timeout for the invert effect duration
        setTimeout(() => {
            currentLevelInPhase.value++;
            globalLevel.value++;

            if (currentLevelInPhase.value > levelsPerPhase) {
                // End of current phase
                if (gamePhase.value === '2x2_LEVELS') {
                    router.push('/task/rest'); // Navigate to rest page
                    return;
                } else if (gamePhase.value === '3x3_LEVELS') {
                    gamePhase.value = 'GAME_OVER';
                    // alert('遊戲結束！'); // Temporary feedback
                    router.push('/prepare'); // Go back to prepare page
                    return;
                }
            }
            generateLevel(); // Generate next level
        }, 150); // 150ms invert effect duration
    } else {
        // Incorrect guess
        feedbackState.value = 'ERROR';
        if (navigator.vibrate) navigator.vibrate(200); // Haptic feedback

        setTimeout(() => {
            feedbackState.value = 'IDLE'; // Reset feedback state after shake
            selectedIndex.value = -1;
            generateLevel(); // Regenerate level after error
        }, 500); // Shake duration
    }
};


// --- Exit Confirmation Logic ---
const showExitConfirmation = ref(false);

const handleExit = () => {
    showExitConfirmation.value = true;
};

const cancelExit = () => {
    showExitConfirmation.value = false;
};

const confirmExit = () => {
    router.push('/prepare'); // Go back to prepare page
};

// --- Lifecycle ---
onMounted(() => {
    if (route.query.phase === '3x3') {
        gamePhase.value = '3x3_LEVELS';
        gridSize.value = 3;
        currentLevelInPhase.value = 1;
        globalLevel.value = levelsPerPhase + 1; // Start global level after 2x2 phase
        gameStarted.value = true;
        generateLevel();
    } else {
        startNewGame();
    }
});

</script>

<style scoped>
@keyframes shake {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-2px);
    }

    50% {
        transform: translateX(2px);
    }

    75% {
        transform: translateX(-2px);
    }

    100% {
        transform: translateX(0);
    }
}

.animate-shake {
    animation: shake 0.2s ease-in-out;
}
</style>
