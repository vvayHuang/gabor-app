<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 relative transition-colors duration-100"
        :class="{ 'bg-error/20': feedbackState === 'ERROR' }">
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
        <div v-if="gameStarted && !showPhaseTransition"
            class="grid gap-4 w-full max-w-sm aspect-square transition-transform duration-100 animate-fade-in-up"
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
                    <GaborCanvas :ref="el => { if (el) canvasRefs[index] = el }" :size="gridSize === 2 ? 172 : 110"
                        :params="item" :primary-color="primaryColor" :secondary-color="secondaryColor" />
                </ClientOnly>
            </div>
        </div>

        <!-- Phase Transition Button -->
        <div v-if="showPhaseTransition" class="flex flex-col items-center space-y-4 animate-fade-in-up">
            <h2 class="text-2xl font-light text-inverse-on-surface">第一階段完成</h2>
            <button @click="startNextPhase"
                class="px-8 py-4 bg-primary text-on-primary rounded-full text-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-all">
                繼續第二階段
            </button>
        </div>

        <div v-if="!gameStarted && !showPhaseTransition" class="text-white">Loading game...</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useGameState } from '~/composables/useGameState';
import { useGamePersistence } from '~/composables/useGamePersistence';

import GaborCanvas from '~/components/GaborCanvas.vue';
import TaskProgress from '~/components/TaskProgress.vue';
import IconButton from '~/components/IconButton.vue';

const router = useRouter();
const route = useRoute();

// --- Game State Management ---
const gameState = useGameState();
const persistence = useGamePersistence();

type GamePhase = '2x2_LEVELS' | '3x3_LEVELS' | 'GAME_OVER';
type FeedbackState = 'IDLE' | 'SUCCESS' | 'ERROR';

const gamePhase = ref<GamePhase>('2x2_LEVELS');
const currentLevelInPhase = ref(1);
const globalLevel = ref(1);
const levelsPerPhase = 5;
const gridSize = ref(2); // Initial grid size
const gameStarted = ref(false);
const showPhaseTransition = ref(false);

const feedbackState = ref<FeedbackState>('IDLE');
const selectedIndex = ref(-1);
const canvasRefs = ref<any[]>([]);
const clickStartTime = ref(0);

// --- Gabor Colors ---
const primaryColor = ref('#FFFFFF');
const secondaryColor = ref('#000000');

// --- Gabor Generation State ---
const gridItems = ref<any[]>([]);
const targetIndex = ref(0);
const baseSigma = 40;

// --- Methods ---

const startNewGame = () => {
    gamePhase.value = '2x2_LEVELS';
    currentLevelInPhase.value = 1;
    globalLevel.value = 1;
    gridSize.value = 2;
    gameStarted.value = true;
    showPhaseTransition.value = false;
    generateLevel();
};

const startNextPhase = () => {
    gamePhase.value = '3x3_LEVELS';
    gridSize.value = 3;
    currentLevelInPhase.value = 1;
    // Keep globalLevel continuous
    gameStarted.value = true;
    showPhaseTransition.value = false;
    generateLevel();
};

const generateLevel = () => {
    feedbackState.value = 'IDLE';
    selectedIndex.value = -1;
    clickStartTime.value = Date.now();

    const count = gridSize.value * gridSize.value;
    targetIndex.value = Math.floor(Math.random() * count);

    // Use adaptive difficulty from game state
    const { frequency, contrast } = gameState.state.difficulty;

    // Difficulty Algorithm: difficultyOffset decreases as globalLevel increases
    const minOffset = gridSize.value === 2 ? 10 : 8;
    const difficultyOffset = Math.max(minOffset, 45 - Math.floor(globalLevel.value / 2) * 2);

    const baseAngle = Math.random() * 360;
    const targetAngle = (baseAngle + difficultyOffset) % 360;

    gridItems.value = Array.from({ length: count }, (_, i) => {
        const isTarget = i === targetIndex.value;
        const phase = Math.random() * Math.PI * 2; // Random phase

        // Calculate frequency with a safe minimum to prevent "blob" look
        // Base variation + random factor
        let randomFreq = frequency + (Math.random() * 0.04 - 0.02);
        // Clamp to minimum 0.04 to ensure lines are visible
        randomFreq = Math.max(0.04, randomFreq);

        return {
            orientation: isTarget ? targetAngle : baseAngle,
            // Multi-parameter Challenge: Random frequency for EACH patch, slightly varied around the base difficulty
            frequency: randomFreq,
            contrast: contrast,
            sigma: baseSigma,
            phase: phase,
        };
    });
};

const handleInteraction = (index: number) => {
    if (feedbackState.value !== 'IDLE') return;

    selectedIndex.value = index;
    const responseTime = Date.now() - clickStartTime.value;
    const isCorrect = index === targetIndex.value;

    // Record response in game state
    gameState.recordResponse(isCorrect, responseTime);

    if (isCorrect) {
        // Trigger visual feedback on canvas
        const canvas = canvasRefs.value[index];
        if (canvas && canvas.triggerInvert) {
            canvas.triggerInvert();
        }
        feedbackState.value = 'SUCCESS';

        setTimeout(() => {
            currentLevelInPhase.value++;
            globalLevel.value++;

            if (currentLevelInPhase.value > levelsPerPhase) {
                // End of phase
                if (gamePhase.value === '2x2_LEVELS') {
                    // Show manual transition button instead of auto-navigating
                    showPhaseTransition.value = true;
                    return;
                } else if (gamePhase.value === '3x3_LEVELS') {
                    // End of entire session -> Save and Go to Rest
                    persistence.updateHighScore(gameState.state.session.score);
                    persistence.updateConsecutiveDays();
                    persistence.addTrainingTime(gameState.state.session.totalTime);


                    gamePhase.value = 'GAME_OVER';
                    router.push('/daily-goal'); // Go to Daily Goal page
                    return;
                }
            }
            generateLevel();
        }, 150);
    } else {
        feedbackState.value = 'ERROR';
        if (navigator.vibrate) navigator.vibrate(200);

        setTimeout(() => {
            feedbackState.value = 'IDLE';
            selectedIndex.value = -1;
            // DO NOT regenerate level on error - play stays on same level per request
            // generateLevel(); 
        }, 500);
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
    // Always start fresh from 2x2 if coming here directly, or check query logic if needed
    // But per request: 2x2 -> button -> 3x3.
    // Let's stick to the standard flow primarily.
    if (route.query.phase === '3x3') {
        startNextPhase();
    } else {
        startNewGame();
    }
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
