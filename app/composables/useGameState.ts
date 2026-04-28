import { reactive, computed } from 'vue'

export type GameState = 'START' | 'PLAYING' | 'REST' | 'RESULTS'

export interface GameSession {
    currentLevel: number
    score: number
    correctCount: number
    incorrectCount: number
    consecutiveCorrect: number
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
        responseTimes: [],
        startTime: 0,
        totalTime: 0
    }
})

export function useGameState() {

    // --- 科學難度引擎 (基於等級) ---
    // 透過等級 (1-100) 計算出當前的任務參數
    const getDifficultyParams = (level: number) => {
        // 1. 對比度 (Contrast): 隨等級指數衰減
        // Lv 1: 1.0 -> Lv 100: 0.05
        const contrast = Math.max(0.05, Math.pow(0.96, level - 1))
        
        // 2. 角度差 (Angle Offset): 隨等級縮小
        // Lv 1: 45度 -> Lv 100: 3度
        const angleOffset = Math.max(3, 45 * Math.pow(0.97, level - 1))
        
        // 3. 空間頻率 (Spatial Frequency): 隨等級增加細節
        // 單位：cycles/mm (需配合 pxPerMm 使用)
        const cyclesPerMm = 0.35 + (level * 0.003)
        
        // 4. 網格大小
        let cols = 3, rows = 4
        if (level >= 15) { cols = 4; rows = 5 }
        if (level >= 40) { cols = 5; rows = 6 }
        if (level >= 70) { cols = 6; rows = 8 }

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
        } else {
            state.session.incorrectCount++
            state.session.consecutiveCorrect = 0
        }
    }

    const startSession = () => {
        state.gameState = 'PLAYING'
        state.session.startTime = Date.now()
        state.session.score = 0
        state.session.correctCount = 0
        state.session.incorrectCount = 0
        state.session.consecutiveCorrect = 0
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
        averageResponseTime,
        accuracy
    }
}
