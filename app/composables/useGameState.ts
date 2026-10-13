import { reactive, computed } from 'vue'

export type GameState = 'START' | 'PLAYING' | 'REST' | 'RESULTS'

export interface GameSession {
    currentLevel: number
    score: number
    correctCount: number
    incorrectCount: number
    consecutiveCorrect: number
    // 局內實際使用的難度（1–100），由 staircase 依作答表現調整
    difficultyLevel: number
    // 這一局開始時的難度，結算頁用來顯示本局的難度變化
    startDifficultyLevel: number
    // staircase 用的連對計數，每次升級後歸零（與整局的 consecutiveCorrect 分開）
    staircaseStreak: number
    responseTimes: number[]
    startTime: number
    totalTime: number
}

const state = reactive<{
    gameState: GameState
    session: GameSession
}>({
    gameState: 'START',
    session: {
        currentLevel: 1,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        consecutiveCorrect: 0,
        difficultyLevel: 1,
        startDifficultyLevel: 1,
        staircaseStreak: 0,
        responseTimes: [],
        startTime: 0,
        totalTime: 0
    }
})

export const MIN_DIFFICULTY_LEVEL = 1
export const MAX_DIFFICULTY_LEVEL = 100
// Staircase（2-down-1-up）：連對 2 題難度 +STEP，答錯 1 題 −STEP，
// 長期會收斂在約 71% 正確率。
const STAIRCASE_STEP = 2
const STAIRCASE_CORRECT_TO_STEP_UP = 2

export const clampDifficultyLevel = (level: number) =>
    Math.min(MAX_DIFFICULTY_LEVEL, Math.max(MIN_DIFFICULTY_LEVEL, Math.round(level)))

export function useGameState() {

    // --- 科學難度引擎 (基於等級) ---
    // 透過等級 (1-100) 計算出當前的任務參數
    const getDifficultyParams = (level: number) => {
        // 1. 對比度 (Contrast): 隨等級指數衰減，下限 0.25（約難度 47 之後不再變淡）。
        // 原為 0.94 / 下限 0.03，實機上難度 20 以後條紋太淡（D04）。
        const contrast = Math.max(0.25, Math.pow(0.97, level - 1))
        
        // 2. 角度差 (Angle Offset): 隨等級縮小，起始 30、下限 2。
        // 係數原為 0.95，粗細擾動放寬後實機上太難分辨，放慢為 0.97（D04）。
        const angleOffset = Math.max(2, 30 * Math.pow(0.97, level - 1))
        
        // 3. 空間頻率 (Spatial Frequency): 隨等級增加細節 (提升斜率)
        const cyclesPerMm = 0.38 + (level * 0.005)
        
        // 4. 網格大小 (強化版：大幅提前門檻)
        let cols = 3, rows = 4
        if (level >= 8) { cols = 4; rows = 5 }
        if (level >= 20) { cols = 5; rows = 6 }
        if (level >= 45) { cols = 6; rows = 8 }

        return {
            contrast,
            angleOffset,
            cyclesPerMm,
            grid: { cols, rows }
        }
    }

    const recordResponse = (isCorrect: boolean, responseTime: number) => {
        state.session.responseTimes.push(responseTime)

        if (isCorrect) {
            state.session.correctCount++
            state.session.consecutiveCorrect++
            // 分數計算：基礎 100 分 + 反應時間獎勵 (最高 400 分)
            const speedBonus = Math.max(0, 400 - (responseTime / 10))
            state.session.score += Math.floor(100 + speedBonus)

            state.session.staircaseStreak++
            if (state.session.staircaseStreak >= STAIRCASE_CORRECT_TO_STEP_UP) {
                state.session.difficultyLevel = clampDifficultyLevel(state.session.difficultyLevel + STAIRCASE_STEP)
                state.session.staircaseStreak = 0
            }
        } else {
            state.session.incorrectCount++
            state.session.consecutiveCorrect = 0

            state.session.difficultyLevel = clampDifficultyLevel(state.session.difficultyLevel - STAIRCASE_STEP)
            state.session.staircaseStreak = 0
        }
    }

    // 設定這一局的起始難度（上一局結束時的難度，由 persistence 提供）
    const setDifficultyLevel = (level: number) => {
        state.session.difficultyLevel = clampDifficultyLevel(level)
        state.session.startDifficultyLevel = state.session.difficultyLevel
        state.session.staircaseStreak = 0
    }

    const startSession = () => {
        state.gameState = 'PLAYING'
        state.session.startTime = Date.now()
        state.session.score = 0
        state.session.correctCount = 0
        state.session.incorrectCount = 0
        state.session.consecutiveCorrect = 0
        state.session.staircaseStreak = 0
        state.session.responseTimes = []
    }

    const endSession = () => {
        state.session.totalTime = Date.now() - state.session.startTime
        state.gameState = 'REST'
    }

    const resetGame = () => {
        state.gameState = 'START'
    }

    const averageResponseTime = computed(() => {
        if (state.session.responseTimes.length === 0) return 0
        return state.session.responseTimes.reduce((a, b) => a + b, 0) / state.session.responseTimes.length
    })

    const accuracy = computed(() => {
        const total = state.session.correctCount + state.session.incorrectCount
        if (total === 0) return 0
        return (state.session.correctCount / total) * 100
    })

    return {
        state,
        getDifficultyParams,
        startSession,
        endSession,
        resetGame,
        recordResponse,
        setDifficultyLevel,
        averageResponseTime,
        accuracy
    }
}
