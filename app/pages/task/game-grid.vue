<template>
    <div ref="pageContainer" class="flex-1 flex flex-col px-4 space-y-8 relative transition-colors duration-100">
        <!-- Header & Title (Hidden during phase transition) -->
        <template v-if="!showPhaseTransition">
            <TaskHeader class="z-20 w-full pt-4" :current="currentLevelInPhase - 1" :total="levelsPerPhase"
                @exit="handleExit" />

            <!-- Instruction Title -->
            <div class="flex items-center space-x-2 mb-8 w-full max-w-2xl mx-auto">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                    <Icon name="material-symbols:question-mark" size="24" class="text-on-primary-fixed" />
                </div>
                <h1 class="headline-sm-emphasis text-on-surface">
                    請在裡面選出不同的符號
                </h1>
            </div>
        </template>

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

        <!-- Game Grid Container -->
        <div v-if="gameStarted && !showPhaseTransition"
            class="relative w-full max-w-2xl mx-auto flex items-center justify-center min-h-[496px]">
            <!-- Actual Game Grid -->
            <div class="grid w-full items-center justify-items-center" :style="{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
                gap: `${gridGap}px`,
                opacity: isGridReady ? 1 : 0
            }">
                <div v-for="(item, index) in gridItems" :key="`cell-${index}`"
                    :ref="(el) => { if (el) gridItemRefs[index] = el }"
                    class="relative group aspect-square flex items-center justify-center cursor-pointer"
                    @click="handleInteraction(index)" :class="{ 'pointer-events-none': feedbackState !== 'IDLE' }">
                    <div
                        class="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-colors pointer-events-none z-10">
                    </div>
                    <div class="absolute inset-0 rounded-full bg-white mix-blend-difference pointer-events-none z-30 transition-opacity duration-75"
                        :class="(feedbackState === 'SUCCESS' && selectedIndex === index) ? 'opacity-100' : 'opacity-0'">
                    </div>
                    <ClientOnly>
                        <GaborCanvas :ref="el => { if (el) canvasRefs[index] = el }" :size="canvasSize" :params="item"
                            :primary-color="primaryColor" :secondary-color="secondaryColor"
                            @ready="handleCanvasReady" />
                    </ClientOnly>
                </div>
            </div>
        </div>

        <!-- Phase Transition UI -->
        <div v-if="showPhaseTransition" class="fixed inset-0 z-30 flex flex-col items-center justify-center p-4">
            <div ref="transitionText" class="text-center space-y-2 opacity-0">
                <h2 class="display-md text-on-surface">第一階段完成</h2>
                <p class="body-large-emphasis text-on-surface">準備好進入更具挑戰性的第二階段了？</p>
            </div>

            <!-- Bottom Action Area (Consistent with other pages) -->
            <div ref="transitionButton" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-[calc(16px+env(safe-area-inset-bottom))] opacity-0">
                <Buttons buttonStyle="Bordered - Prominent" size="Large" @click="startNextPhase" label="開始" />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { useGameState } from '~/composables/useGameState';
import { useGamePersistence } from '~/composables/useGamePersistence';



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
const pageContainer = ref<HTMLElement | null>(null);
const transitionText = ref<HTMLElement | null>(null);
const transitionButton = ref<HTMLElement | null>(null);
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

const updateAllCanvases = () => {
    canvasRefs.value.forEach(canvas => {
        if (canvas && canvas.drawGabor) {
            canvas.drawGabor();
        }
    });

    const validRefs = gridItemRefs.value.filter(el => el);

    // 1. 在容器顯示前，先強制設定符號為隱藏且縮小狀態
    if (validRefs.length > 0) {
        gsap.set(validRefs, {
            scale: 0.4,
            opacity: 0
        });
    }

    // 2. 顯示容器
    isGridReady.value = true;

    // 3. 執行進場動畫
    if (validRefs.length > 0) {
        gsap.to(validRefs, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: 'back.out(1.5)',
            overwrite: true
        });
    }
}

const handleCanvasReady = () => {
    readyCount.value++;
    if (readyCount.value >= gridItems.value.length) {
        // All p5 instances are ready, draw them all at once
        updateAllCanvases();
    }
};

const startNewGame = () => {
    gameState.startSession();
    gamePhase.value = 'STAGE_1';
    gridCols.value = 3;
    gridRows.value = 4;
    gridGap.value = 16;
    canvasSize.value = 100;
    currentLevelInPhase.value = 1;
    globalLevel.value = 1;
    gameStarted.value = true;
    showPhaseTransition.value = false;

    // Clear refs when changing grid size
    canvasRefs.value = [];
    gridItemRefs.value = [];

    generateLevel();
};

const startNextPhase = () => {
    showPhaseTransition.value = false;
    isGridReady.value = false; // Reset ready state immediately

    // Update grid dimensions immediately to avoid count mismatch
    gamePhase.value = 'STAGE_2';
    gridCols.value = 3;
    gridRows.value = 5;
    gridGap.value = 16;
    canvasSize.value = 90;
    currentLevelInPhase.value = 1;
    gameStarted.value = true;

    // Clear old data to ensure fresh start
    gridItems.value = [];
    canvasRefs.value = [];
    gridItemRefs.value = [];

    nextTick(() => {
        generateLevel();
    });
};

const generateLevel = () => {
    feedbackState.value = 'IDLE';
    selectedIndex.value = -1;
    readyCount.value = 0;

    // Always show skeleton between levels for consistent feedback
    isGridReady.value = false;

    nextTick(() => {
        clickStartTime.value = Date.now();
        const count = gridCols.value * gridRows.value;
        targetIndex.value = Math.floor(Math.random() * count);

        const { contrast } = gameState.state.difficulty;
        const minOffset = 3;
        const difficultyOffset = Math.max(minOffset, 30 - Math.floor(globalLevel.value / 2) * 4);

        const baseAngle = Math.random() * 360;
        const targetAngle = (baseAngle + difficultyOffset) % 360;

        gridItems.value = Array.from({ length: count }, (_, i) => {
            const isTarget = i === targetIndex.value;
            const phase = Math.random() * Math.PI;
            const baseFrequency = 5 / canvasSize.value;
            const randomFreq = baseFrequency + (Math.random() - 0.5) * (baseFrequency * 0.9);
            const sigma = canvasSize.value / (4.5 + (Math.random() - 0.5) * 1.5);
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

        // If components are already mounted (reused), p5 will update via 'watch'.
        // We give it a short time to finish rendering before hiding skeleton.
        setTimeout(() => {
            updateAllCanvases();
        }, 30); // Reduced delay for smoother transition
    });
};

const handleInteraction = (index: number) => {
    if (feedbackState.value !== 'IDLE') return;

    selectedIndex.value = index;
    const responseTime = Date.now() - clickStartTime.value;
    const isCorrect = index === targetIndex.value;

    gameState.recordResponse(isCorrect, responseTime);

    if (isCorrect) {
        const targetEl = gridItemRefs.value[index];
        feedbackState.value = 'SUCCESS';

        // 1. 立即執行「正確符號消失」動畫
        if (targetEl) {
            gsap.to(targetEl, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });
        }

        // 2. 立即更新進度，讓進度條跑到 100%
        currentLevelInPhase.value++;
        globalLevel.value++;

        // 3. 等待進度條動畫跑完
        setTimeout(() => {
            if (gamePhase.value === 'GAME_OVER') return;

            // 檢查是否為該階段的最後一關
            if (currentLevelInPhase.value > levelsPerPhase) {
                // 4. 階段結束：符號更緩慢地交錯淡出
                const validRefs = gridItemRefs.value.filter(el => el);
                gsap.to(validRefs, {
                    opacity: 0,
                    scale: 0.6,
                    duration: 0.8, // 放慢速度
                    stagger: {
                        each: 0.06,
                        from: "center"
                    },
                    ease: 'power2.inOut',
                    onComplete: () => {
                        if (gamePhase.value === 'STAGE_1') {
                            showPhaseTransition.value = true;
                            isGridReady.value = false;

                            // 5. 過渡 UI 序列動畫
                            nextTick(() => {
                                const tl = gsap.timeline();
                                tl.to(transitionText.value, {
                                    opacity: 1,
                                    y: -20,
                                    duration: 0.8,
                                    ease: 'power2.out'
                                })
                                    .to(transitionButton.value, {
                                        opacity: 1,
                                        y: 0,
                                        duration: 0.6,
                                        ease: 'power2.out'
                                    }, "-=0.2");
                            });
                        } else if (gamePhase.value === 'STAGE_2') {
                            handleGameOver();
                        }
                    }
                });
                return;
            }

            // 6. 若非最後一關，生成下一關
            generateLevel();
        }, 300);

    } else {
        // 錯誤處理 (保持原樣，因為原本就有震動與抖動動畫)
        feedbackState.value = 'ERROR';
        if (navigator.vibrate) navigator.vibrate(100);

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
                        gsap.set(targetEl, { x: 0 });
                        feedbackState.value = 'IDLE';
                        selectedIndex.value = -1;
                    }
                }
            );
        }
    }
};

const handleGameOver = () => {
    // 遊戲完全結束：頁面淡出後再跳轉
    if (!pageContainer.value) return;
    gsap.to(pageContainer.value, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
            gamePhase.value = 'GAME_OVER';
            nextTick(() => {
                gameState.endSession();
                persistence.updateHighScore(gameState.state.session.score);
                persistence.updateConsecutiveDays();
                persistence.addTrainingTime(gameState.state.session.totalTime);

                const score = gameState.state.session.score;
                let intensity = 1;
                if (score >= 80) intensity = 5;
                else if (score >= 60) intensity = 4;
                else if (score >= 40) intensity = 3;
                else if (score >= 20) intensity = 2;

                persistence.recordAchievement(intensity);
                router.push('/daily-goal');
            });
        }
    });
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
/* No additional scoped styles needed */
</style>
