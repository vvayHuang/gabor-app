<template>
    <div ref="pageContainer" class="flex-1 flex flex-col px-4 space-y-8 relative transition-colors duration-100">
        <!-- Header & Title (Hidden during phase transition) -->
        <template v-if="!showPhaseTransition">
            <TaskHeader class="z-20 w-full max-w-2xl lg:max-w-4xl mx-auto pt-4" :current="currentLevelInPhase - 1" :total="levelsPerPhase"
                @exit="handleExit" />

            <!-- Instruction Title -->
            <div class="flex items-center space-x-2 mb-8 w-full max-w-2xl lg:max-w-4xl mx-auto">
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
            class="relative w-full max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-center min-h-[496px] lg:min-h-[620px]">
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
                    @click="handleInteraction(index)" :class="{ 'pointer-events-none': feedbackState !== 'IDLE' || !isInputEnabled }">
                    <div class="absolute rounded-full bg-primary/20 ring-2 ring-primary/70 pointer-events-none z-20 transition-all duration-100"
                        :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
                        :class="(feedbackState === 'SUCCESS' && selectedIndex === index) ? 'opacity-100 scale-105' : 'opacity-0 scale-95'">
                    </div>
                    <ClientOnly>
                        <GaborCanvas :ref="el => { if (el) canvasRefs[index] = el }" :size="canvasSize" :params="item"
                            :primary-color="primaryColor" :secondary-color="secondaryColor"
                            :profile-gamma="profileGamma" />
                    </ClientOnly>
                </div>
            </div>
        </div>

        <!-- Phase Transition UI -->
        <div v-if="showPhaseTransition" class="fixed inset-0 z-30 flex flex-col items-center justify-center p-4">
            <div ref="transitionText" class="text-center space-y-2 opacity-0">
                <h2 class="display-md text-on-surface">第一階段完成</h2>
                <p class="body-lg-emphasis text-on-surface text-balance">準備好進入更具挑戰性的第二階段了？</p>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
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
// 響應式計算斑塊尺寸，大螢幕 (lg breakpoint >= 1024px) 下顯著放大，確保桌面端條紋特徵大而清晰
const getResponsiveSize = (cols: number, rows: number) => {
    if (typeof window === 'undefined') return cols > 4 ? 65 : (cols > 3 ? 80 : 100);
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
        const idealSize = cols > 5 ? 110 : (cols > 4 ? 130 : (cols > 3 ? 150 : 185));
        const maxGridWidth = Math.min(window.innerWidth * 0.78, 896);
        const widthBound = (maxGridWidth - ((cols - 1) * gridGap.value)) / cols;
        const heightBound = (window.innerHeight - 300 - ((rows - 1) * gridGap.value)) / rows;
        return Math.max(96, Math.floor(Math.min(idealSize, widthBound, heightBound)));
    }
    // 行動端原本尺寸
    return cols > 4 ? 65 : (cols > 3 ? 80 : 100);
};

const canvasSize = ref(80);

const updateResponsiveSize = () => {
    canvasSize.value = getResponsiveSize(gridCols.value, gridRows.value);
};
const gameStarted = ref(false);
const showPhaseTransition = ref(false);

const feedbackState = ref<FeedbackState>('IDLE');
const selectedIndex = ref(-1);
const canvasRefs = ref<any[]>([]);
const gridItemRefs = ref<any[]>([]);
const pageContainer = ref<HTMLElement | null>(null);
const transitionText = ref<HTMLElement | null>(null);
const transitionButton = ref<HTMLElement | null>(null);
const isGridReady = ref(false);
const clickStartTime = ref(0);
// 進場動畫播完才開放作答並開始計時，反應時間不含進場動畫。
const isInputEnabled = ref(false);
// 每產生一題就遞增，讓上一題殘留的動畫回呼無法開放新一題的作答。
let levelToken = 0;
// 頁面是否仍掛載中。GSAP 不會因元件卸載而自動停止 tween，計時器同理，
// 因此離開頁面後的殘留回呼必須靠這個旗標擋下，避免把玩家從別的頁面彈走。
let isPageActive = true;

// --- Colors (Deeper Scientific Palette) ---
// Canvas 本身保持透明，底色與墨色皆取自設計系統的 surface / on-surface：
// 深色 #101318 / #E1E2EC，淺色 #F9F9FF / #181C23。
const primaryColor = computed(() => settings.isDarkMode.value ? '#101318' : '#F9F9FF');
const secondaryColor = computed(() => settings.isDarkMode.value ? '#E1E2EC' : '#181C23');
// on-surface 的墨色比純黑／純白弱，可見度改由 gamma < 1 抬升輪廓中低強度區補回，
// 而不是把墨色調到色票以外。深色底缺少「白紙吸墨」的餘裕，需要抬得比淺色多。
const profileGamma = computed(() => settings.isDarkMode.value ? 0.68 : 0.9);

// --- Level Data ---
const gridItems = ref<any[]>([]);
const targetIndex = ref(0);

// --- Core Logic ---

// 只負責進場動畫；斑塊繪製由 GaborCanvas 自己的 watcher 處理，避免同一關重複繪製。
const playGridEntrance = () => {
    const token = levelToken;
    // onComplete 與 onInterrupt 都要開放作答：動畫被中斷時 onComplete 不會觸發，
    // 只掛 onComplete 會讓整個網格永遠不能點。
    const enableInput = () => {
        if (!isPageActive || token !== levelToken || isInputEnabled.value) return;
        clickStartTime.value = Date.now();
        isInputEnabled.value = true;
    };

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
            overwrite: true,
            onComplete: enableInput,
            onInterrupt: enableInput
        });
    } else {
        // 沒有可動畫的格子時不能等一個永遠不會回呼的 tween
        enableInput();
    }
}

const startNewGame = async () => {
    gameState.startSession();
    await persistence.loadStats();
    
    // 從難度引擎獲取初始參數
    const params = gameState.getDifficultyParams(persistence.currentLevel.value);
    gridCols.value = params.grid.cols;
    gridRows.value = params.grid.rows;
    canvasSize.value = getResponsiveSize(gridCols.value, gridRows.value);

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

    // 第二階段難度微調
    const nextLevelSim = persistence.currentLevel.value + 5;
    const params = gameState.getDifficultyParams(nextLevelSim);
    
    gridCols.value = params.grid.cols;
    gridRows.value = params.grid.rows;
    canvasSize.value = getResponsiveSize(gridCols.value, gridRows.value);
    
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
    isGridReady.value = false;
    isInputEnabled.value = false;
    levelToken++;

    nextTick(() => {
        const count = gridCols.value * gridRows.value;
        targetIndex.value = Math.floor(Math.random() * count);

        // --- 呼叫難度引擎 ---
        const lv = persistence.currentLevel.value;
        const phaseBonus = gamePhase.value === 'STAGE_2' ? 5 : 0;
        const diff = gameState.getDifficultyParams(lv + phaseBonus);

        const baseAngle = Math.random() * 360;
        const targetAngle = (baseAngle + diff.angleOffset) % 360;
        const baseSF = diff.cyclesPerMm / settings.pxPerMm.value;

        gridItems.value = Array.from({ length: count }, (_, i) => {
            const isTarget = i === targetIndex.value;

            // 樣式可各自變化，但答題判斷仍只看目標項的角度差。
            const orientation = isTarget ? targetAngle : baseAngle;
            const frequency = baseSF * (0.28 + Math.random() * 0.38);
            const sigma = (3.7 + Math.random() * 1.5) * settings.pxPerMm.value;
            const phase = Math.random() * Math.PI * 2;
            const contrast = Math.min(1, diff.contrast * (1.0 + Math.random() * 0.22));

            return {
                orientation,
                frequency,
                contrast,
                sigma,
                phase,
            };
        });

        nextTick(() => playGridEntrance());
    });
};

// 解除答題鎖定：feedbackState 一旦離開 IDLE，網格會套用 pointer-events-none，
// 因此所有離開 ERROR 的路徑都必須經過這裡。
const clearFeedback = () => {
    feedbackState.value = 'IDLE';
    selectedIndex.value = -1;
};

// 一個階段的最後一題答完後的收尾：進入階段轉場或結算整局。
const finishPhase = () => {
    // 卸載後才觸發的回呼（例如玩家在收尾動畫播放中按了離開）不得繼續推進流程，
    // 避免對已銷毀的頁面寫入狀態。
    if (!isPageActive || gamePhase.value === 'GAME_OVER') return;

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
};

const handleInteraction = (index: number) => {
    if (!isInputEnabled.value || feedbackState.value !== 'IDLE') return;

    selectedIndex.value = index;
    const responseTime = Date.now() - clickStartTime.value;
    const isCorrect = index === targetIndex.value;

    gameState.recordResponse(isCorrect, responseTime);

    if (isCorrect) {
        playSound('success');
        const targetEl = gridItemRefs.value[index];
        const targetCanvas = canvasRefs.value[index];
        feedbackState.value = 'SUCCESS';

        if (targetCanvas?.triggerInvert) {
            targetCanvas.triggerInvert();
        }

        if (targetEl) {
            gsap.timeline()
                .to(targetEl, { scale: 1.08, duration: 0.12, ease: 'power2.out' })
                .to(targetEl, { scale: 0, opacity: 0, duration: 0.28, ease: 'power2.in' });
        }

        currentLevelInPhase.value++;

        advanceTimer = setTimeout(() => {
            advanceTimer = null;
            if (!isPageActive || gamePhase.value === 'GAME_OVER') return;

            if (currentLevelInPhase.value > levelsPerPhase) {
                const validRefs = gridItemRefs.value.filter(el => el);
                if (validRefs.length > 0) {
                    // 與答錯分支同樣的理由：動畫被中斷時 onComplete 不會觸發，
                    // 若只掛 onComplete，階段結束就會停在空白畫面。
                    gsap.to(validRefs, {
                        opacity: 0,
                        scale: 0.6,
                        duration: 0.8,
                        stagger: { each: 0.06, from: "center" },
                        ease: 'power2.inOut',
                        onComplete: finishPhase,
                        onInterrupt: finishPhase
                    });
                } else {
                    // 沒有可動畫的格子時直接結算，不能等一個永遠不會回呼的 tween
                    finishPhase();
                }
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
            // onComplete 與 onInterrupt 都要復位：若這個 tween 在播完前被其他
            // 帶 overwrite 的動畫殺掉，只靠 onComplete 會永遠回不到 IDLE。
            const releaseAfterShake = () => {
                gsap.set(targetEl, { x: 0 });
                clearFeedback();
            };
            gsap.fromTo(targetEl, { x: 0 }, {
                x: 6, duration: 0.07, repeat: 5, yoyo: true, ease: 'power2.inOut',
                onComplete: releaseAfterShake,
                onInterrupt: releaseAfterShake
            });
        } else {
            // 取不到 DOM ref 時沒有動畫可等，必須立刻復位，
            // 否則 feedbackState 會卡在 ERROR，所有格子的 pointer-events-none
            // 不會解除，玩家只能退出遊戲。
            clearFeedback();
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

            gameState.endSession();

            await persistence.recordSession({
                score,
                accuracy,
                correct_count: session.correctCount,
                incorrect_count: session.incorrectCount,
                avg_response_time: gameState.averageResponseTime.value,
                total_time_ms: totalTime
            });

            // 以下四個為純本地狀態異動，最後統一呼叫一次 saveStats() 持久化，
            // 避免每個函式各自觸發 getUser() / upsert（原本結算一次最多產生近 10 次網路請求）。
            persistence.updateHighScore(score);
            persistence.updateConsecutiveDays();
            persistence.addTrainingTime(totalTime);
            persistence.recordAchievement(Math.floor(score / 500) + 1);
            await persistence.saveStats();

            router.push('/daily-goal');
        }
    });
};

const showExitConfirmation = ref(false);
const handleExit = () => showExitConfirmation.value = true;
const cancelExit = () => showExitConfirmation.value = false;
const confirmExit = () => router.push('/prepare');

let resizeHandler: (() => void) | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
// 答對後推進下一關（或收尾）的計時器，卸載時必須清掉
let advanceTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
    gridItemRefs.value = []
    settings.loadSettings();

    // resize 監聽器：debounce 後只更新 canvasSize，
    // 尺寸真的改變時由各個 GaborCanvas 自行重繪一次（拖曳視窗不會連續重繪整個網格）。
    resizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateResponsiveSize, 120);
    };
    window.addEventListener('resize', resizeHandler);

    await startNewGame();
});

onUnmounted(() => {
    // 順序很重要：先關掉旗標，再殺 tween。killTweensOf 會觸發 onInterrupt，
    // 旗標若還開著，收尾動畫的 onInterrupt 就會在頁面已卸載後繼續推進流程。
    isPageActive = false;

    if (advanceTimer) {
        clearTimeout(advanceTimer);
        advanceTimer = null;
    }
    if (resizeTimer) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }

    // GSAP 不會因為元件卸載就停止動畫，殘留的 tween 會繼續在脫離 DOM 的節點上執行。
    const animatedTargets = [
        ...gridItemRefs.value.filter(el => el),
        pageContainer.value,
        transitionText.value,
        transitionButton.value
    ].filter(Boolean);
    if (animatedTargets.length > 0) {
        gsap.killTweensOf(animatedTargets);
    }
});
</script>
