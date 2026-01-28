<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 relative transition-colors duration-100">
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

        <div v-show="gameStarted && !showPhaseTransition && isGridReady"
            class="grid w-full h-full max-w-2xl mx-auto items-center justify-items-center transition-opacity duration-300 animate-fade-in-up"
            :style="{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
                gap: `${gridGap}px`
            }" :class="[isGridReady ? 'opacity-100' : 'opacity-0']">
            <div v-for="(item, index) in gridItems" :key="`level-${globalLevel}-${index}`"
                ref="gridItemRefs"
                class="relative group aspect-square flex items-center justify-center cursor-pointer"
                @click="handleInteraction(index)" :class="{ 'pointer-events-none': feedbackState !== 'IDLE' }">
                <!-- Active state style on hover/active handled mainly by JS logic in real app, but CSS hover here -->
                <div
                    class="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-colors pointer-events-none z-10">
                </div>

                <!-- Feedback Overlay (Invert) -->
                <div class="absolute inset-0 rounded-full bg-white mix-blend-difference pointer-events-none z-30 transition-opacity duration-75"
                    :class="(feedbackState === 'SUCCESS' && selectedIndex === index) ? 'opacity-100' : 'opacity-0'">
                </div>

                <ClientOnly>
                    <GaborCanvas :ref="el => { if (el) canvasRefs[index] = el }" :size="canvasSize" :params="item"
                        :primary-color="primaryColor" :secondary-color="secondaryColor" @ready="handleCanvasReady" />
                </ClientOnly>
            </div>
        </div>

        <div v-if="gameStarted && !showPhaseTransition && !isGridReady" class="text-white/40 animate-pulse">
            準備中...
        </div>

        <!-- Phase Transition Button -->
        <div v-if="showPhaseTransition" class="flex flex-col items-center space-y-6 animate-fade-in-up">
            <div class="text-center space-y-2">
                <h2 class="display-md text-white">第一階段完成</h2>
                <p class="text-white/60">準備好進入更具挑戰性的第二階段了？</p>
            </div>
            <GaborButton variant="primary" @click="startNextPhase" label="開始第二階段" />
        </div>

        <div v-if="!gameStarted && !showPhaseTransition" class="text-white">Loading game...</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
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

type GamePhase = 'STAGE_1' | 'STAGE_2' | 'GAME_OVER';
type FeedbackState = 'IDLE' | 'SUCCESS' | 'ERROR';

const gamePhase = ref<GamePhase>('STAGE_1');
const currentLevelInPhase = ref(1);
const globalLevel = ref(1);
const levelsPerPhase = 5; // Each stage has 5 levels
const gridCols = ref(3);
const gridRows = ref(4);
const gridGap = ref(16);
const canvasSize = ref(100);
const gameStarted = ref(false);
const showPhaseTransition = ref(false);

const feedbackState = ref<FeedbackState>('IDLE');
const selectedIndex = ref(-1);
const canvasRefs = ref<any[]>([]);
const gridItemRefs = ref<any[]>([]);
const readyCount = ref(0);
const isGridReady = ref(false);
const clickStartTime = ref(0);

// --- Gabor Colors ---
const primaryColor = ref('#FFFFFF');
const secondaryColor = ref('#000000');

// --- Gabor Generation State ---
const gridItems = ref<any[]>([]);
const targetIndex = ref(0);
const baseSigma = 32;

// --- Methods ---

const drawCanvasesSequentially = (index = 0) => {
    if (index >= canvasRefs.value.length) {
        // All canvases are drawn
        isGridReady.value = true;
        return;
    }

    const canvas = canvasRefs.value[index];
    if (canvas && canvas.drawGabor) {
        canvas.drawGabor();
    }

    // Request the next frame to draw the next canvas
    requestAnimationFrame(() => drawCanvasesSequentially(index + 1));
}


const handleCanvasReady = () => {
    readyCount.value++;
    if (readyCount.value >= gridItems.value.length) {
        // All p5 instances are ready, now we can start drawing them sequentially
        drawCanvasesSequentially();
    }
};

const startNewGame = () => {
    gamePhase.value = 'STAGE_1';
    gridCols.value = 3;
    gridRows.value = 4;
    gridGap.value = 16;
    canvasSize.value = 100;
    currentLevelInPhase.value = 1;
    globalLevel.value = 1;
    gameStarted.value = true;
    showPhaseTransition.value = false;
    generateLevel();
};

const startNextPhase = () => {
    gamePhase.value = 'STAGE_2';
    gridCols.value = 3; // From 5
    gridRows.value = 5; // From 6
    gridGap.value = 16; // More space, can use larger gap
    canvasSize.value = 90; // Larger symbols as the grid is less dense
    currentLevelInPhase.value = 1;
    // Keep globalLevel continuous
    gameStarted.value = true;
    showPhaseTransition.value = false;
    generateLevel();
};

const generateLevel = () => {
    feedbackState.value = 'IDLE';
    selectedIndex.value = -1;
    isGridReady.value = false;
    readyCount.value = 0;
    clickStartTime.value = Date.now();

    const count = gridCols.value * gridRows.value;
    targetIndex.value = Math.floor(Math.random() * count);

    // Use adaptive difficulty from game state
    const { contrast } = gameState.state.difficulty;

    // Difficulty Algorithm: target angle offset decreases as globalLevel increases
    const minOffset = 3;
    const difficultyOffset = Math.max(minOffset, 30 - Math.floor(globalLevel.value / 2) * 4);

    const baseAngle = Math.random() * 360;
    const targetAngle = (baseAngle + difficultyOffset) % 360;

    gridItems.value = Array.from({ length: count }, (_, i) => {
        const isTarget = i === targetIndex.value;
        const phase = Math.random() * Math.PI; // Random phase for variety

        // --- Responsive Gabor Parameters ---
        // Frequency (lines per pixel) scaled with canvas size for consistent appearance
        const baseFrequency = 5 / canvasSize.value;
        // Increased variation for frequency (more noticeable difference in line count)
        const randomFreq = baseFrequency + (Math.random() - 0.5) * (baseFrequency * 0.9);

        // Sigma (envelope size) scaled to canvas size, with added variation
        // This makes the patch size itself slightly different each time
        const sigma = canvasSize.value / (4.5 + (Math.random() - 0.5) * 1.5);
        
        // Orientation variety for fillers
        const fillerVariation = (Math.random() * 6 - 3);
        const orientation = isTarget ? targetAngle : (baseAngle + fillerVariation) % 360;

        return {
            orientation: orientation,
            frequency: randomFreq,
            contrast: contrast,
            sigma: sigma,
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
                if (gamePhase.value === 'STAGE_1') {
                    // Show manual transition button
                    showPhaseTransition.value = true;
                    return;
                } else if (gamePhase.value === 'STAGE_2') {
                    // End of entire session -> Save and Go to Rest
                    gameState.endSession();
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
        if (navigator.vibrate) navigator.vibrate(100);

        // GSAP shake animation
        const targetEl = gridItemRefs.value[index];
        if (targetEl) {
            gsap.fromTo(targetEl, 
                { x: 0 }, 
                { 
                    x: 6, 
                    duration: 0.07, 
                    repeat: 5, 
                    yoyo: true, 
                    ease: 'power2.inOut',
                    onComplete: () => {
                        gsap.set(targetEl, { x: 0 }); // Reset position
                        feedbackState.value = 'IDLE';
                        selectedIndex.value = -1;
                    }
                }
            );
        } else {
             setTimeout(() => {
                feedbackState.value = 'IDLE';
                selectedIndex.value = -1;
            }, 500);
        }
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
    gridItemRefs.value = []
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
