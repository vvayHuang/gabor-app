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
                <h1 class="headline-sm-emphasis text-on-surface text-balance">
                    請選出角度不同的符號
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
                <p class="body-large-emphasis text-on-surface text-balance">準備好進入更具挑戰性的第二階段了？</p>
            </div>

            <!-- Bottom Action Area -->
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
import { useAppSettings } from '~/composables/useAppSettings';
import { useAudio } from '~/composables/useAudio';

const router = useRouter();
const route = useRoute();

// --- Composables ---
const gameState = useGameState();
const persistence = useGamePersistence();
const settings = useAppSettings();
const { playSound } = useAudio();

// --- Local State ---
type GamePhase = 'STAGE_1' | 'STAGE_2' | 'GAME_OVER';
type FeedbackState = 'IDLE' | 'SUCCESS' | 'ERROR';

const gamePhase = ref<GamePhase>('STAGE_1');
const currentLevelInPhase = ref(1);
const levelsPerPhase = 5; 
const gridCols = ref(3);
const gridRows = ref(4);
const gridGap = ref(16);
const canvasSize = ref(80);
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

// --- Colors ---
const primaryColor = ref('#FFFFFF');
const secondaryColor = ref('#000000');

// --- Level Data ---
const gridItems = ref<any[]>([]);
const targetIndex = ref(0);

// --- Core Logic ---

const updateAllCanvases = () => {
    canvasRefs.value.forEach(canvas => {
        if (canvas && canvas.drawGabor) canvas.drawGabor();
    });

    const validRefs = gridItemRefs.value.filter(el => el);
    if (validRefs.length > 0) {
        gsap.set(validRefs, { scale: 0.4, opacity: 0 });
        isGridReady.value = true;
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
        updateAllCanvases();
    }
};

const startNewGame = async () => {
    gameState.startSession();
    await persistence.loadStats();
    
    // 從難度引擎獲取初始參數
    const params = gameState.getDifficultyParams(persistence.currentLevel.value);
    gridCols.value = params.grid.cols;
    gridRows.value = params.grid.rows;
    canvasSize.value = gridCols.value > 4 ? 65 : (gridCols.value > 3 ? 80 : 100);

    gamePhase.value = 'STAGE_1';
    currentLevelInPhase.value = 1;
    gameStarted.value = true;
    showPhaseTransition.value = false;

    canvasRefs.value = [];
    gridItemRefs.value = [];

    generateLevel();
};

const startNextPhase = () => {
    showPhaseTransition.value = false;
    isGridReady.value = false; 

    // 第二階段難度微調：模擬提升一級後的難度
    const nextLevelSim = persistence.currentLevel.value + 5;
    const params = gameState.getDifficultyParams(nextLevelSim);
    
    gridCols.value = params.grid.cols;
    gridRows.value = params.grid.rows;
    canvasSize.value = gridCols.value > 4 ? 65 : (gridCols.value > 3 ? 80 : 100);
    
    gamePhase.value = 'STAGE_2';
    currentLevelInPhase.value = 1;
    gameStarted.value = true;

    gridItems.value = [];
    canvasRefs.value = [];
    gridItemRefs.value = [];

    nextTick(() => generateLevel());
};

const generateLevel = () => {
    feedbackState.value = 'IDLE';
    selectedIndex.value = -1;
    readyCount.value = 0;
    isGridReady.value = false;

    nextTick(() => {
        clickStartTime.value = Date.now();
        const count = gridCols.value * gridRows.value;
        targetIndex.value = Math.floor(Math.random() * count);

        // --- 呼叫難度引擎 ---
        const lv = persistence.currentLevel.value;
        const phaseBonus = gamePhase.value === 'STAGE_2' ? 5 : 0;
        const diff = gameState.getDifficultyParams(lv + phaseBonus);

        const baseAngle = Math.random() * 360;
        // 角度差隨等級變小
        const targetAngle = (baseAngle + diff.angleOffset) % 360;

        gridItems.value = Array.from({ length: count }, (_, i) => {
            const isTarget = i === targetIndex.value;
            const phase = Math.random() * Math.PI;
            
            // 物理頻率計算
            const baseFrequency = diff.cyclesPerMm / settings.pxPerMm.value;
            const randomFreq = baseFrequency + (Math.random() - 0.5) * (baseFrequency * 0.1);
            
            // Sigma 基於物理尺寸
            const sigma = 4 * settings.pxPerMm.value;
            
            // 干擾項的角度微差
            const fillerVariation = (Math.random() * 2 - 1);
            const orientation = isTarget ? targetAngle : (baseAngle + fillerVariation) % 360;

            return {
                orientation,
                frequency: randomFreq,
                contrast: diff.contrast,
                sigma,
                phase,
            };
        });

        setTimeout(() => updateAllCanvases(), 30); 
    });
};

const handleInteraction = (index: number) => {
    if (feedbackState.value !== 'IDLE') return;

    selectedIndex.value = index;
    const responseTime = Date.now() - clickStartTime.value;
    const isCorrect = index === targetIndex.value;

    gameState.recordResponse(isCorrect, responseTime);

    if (isCorrect) {
        playSound('success');
        const targetEl = gridItemRefs.value[index];
        feedbackState.value = 'SUCCESS';

        if (targetEl) {
            gsap.to(targetEl, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }

        currentLevelInPhase.value++;

        setTimeout(() => {
            if (gamePhase.value === 'GAME_OVER') return;

            if (currentLevelInPhase.value > levelsPerPhase) {
                const validRefs = gridItemRefs.value.filter(el => el);
                gsap.to(validRefs, {
                    opacity: 0,
                    scale: 0.6,
                    duration: 0.8,
                    stagger: { each: 0.06, from: "center" },
                    ease: 'power2.inOut',
                    onComplete: () => {
                        if (gamePhase.value === 'STAGE_1') {
                            showPhaseTransition.value = true;
                            isGridReady.value = false;
                            nextTick(() => {
                                const tl = gsap.timeline();
                                tl.to(transitionText.value, { opacity: 1, y: -20, duration: 0.8, ease: 'power2.out' })
                                  .to(transitionButton.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "-=0.2");
                            });
                        } else {
                            handleGameOver();
                        }
                    }
                });
                return;
            }
            generateLevel();
        }, 300);

    } else {
        playSound('error');
        feedbackState.value = 'ERROR';
        if (navigator.vibrate) navigator.vibrate(100);

        const targetEl = gridItemRefs.value[index];
        if (targetEl) {
            gsap.fromTo(targetEl, { x: 0 }, {
                x: 6, duration: 0.07, repeat: 5, yoyo: true, ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(targetEl, { x: 0 });
                    feedbackState.value = 'IDLE';
                    selectedIndex.value = -1;
                }
            });
        }
    }
};

const handleGameOver = () => {
    if (!pageContainer.value) return;
    gsap.to(pageContainer.value, {
        opacity: 0, duration: 0.6, ease: 'power2.inOut',
        onComplete: async () => {
            gamePhase.value = 'GAME_OVER';
            const session = gameState.state.session;
            const score = session.score;
            const accuracy = gameState.accuracy.value;
            const totalTime = Date.now() - session.startTime;

            // 1. 結束 Session 並計算最終數據
            gameState.endSession();

            // 2. 紀錄單次會話 (新增)
            await persistence.recordSession({
                score,
                accuracy,
                correct_count: session.correct_count,
                incorrect_count: session.incorrect_count,
                avg_response_time: gameState.averageResponseTime.value,
                total_time_ms: totalTime
            });

            // 3. 更新總結性數據 (改為 await)
            await persistence.updateHighScore(score);
            await persistence.updateConsecutiveDays();
            await persistence.addTrainingTime(totalTime);
            await persistence.recordAchievement(Math.floor(score / 500) + 1);

            router.push('/daily-goal');
        }
    });
};

const showExitConfirmation = ref(false);
const handleExit = () => showExitConfirmation.value = true;
const cancelExit = () => showExitConfirmation.value = false;
const confirmExit = () => router.push('/prepare');

onMounted(async () => {
    gridItemRefs.value = []
    await startNewGame();
});
</script>
