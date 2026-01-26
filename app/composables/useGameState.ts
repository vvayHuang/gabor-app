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

export function useGameState() {
    const state = reactive<{
        gameState: GameState
        session: GameSession
        difficulty: {
            frequency: number
            contrast: number
            gridSize: number
        }
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
        },
        difficulty: {
            frequency: 0.04, // 初始值：確保線條清晰 (0.025 -> 0.04)
            contrast: 1.0,
            gridSize: 4 // 2x2 grid
        }
    })

    // Adaptive Difficulty Logic
    const adjustDifficulty = (responseTime: number, isCorrect: boolean) => {
        if (isCorrect) {
            state.session.consecutiveCorrect++

            // 連對且反應快 -> 降低對比度 (更難)
            if (state.session.consecutiveCorrect >= 3 && responseTime < 1500) {
                state.difficulty.contrast = Math.max(0.3, state.difficulty.contrast - 0.1)
                state.difficulty.frequency = Math.min(0.08, state.difficulty.frequency + 0.005)
            }
        } else {
            state.session.consecutiveCorrect = 0

            // 反應慢或錯誤 -> 加粗條紋、提高對比度 (更容易)
            if (responseTime > 3000 || !isCorrect) {
                state.difficulty.contrast = Math.min(1.0, state.difficulty.contrast + 0.1)
                state.difficulty.frequency = Math.max(0.02, state.difficulty.frequency - 0.005)
            }
        }
    }

    const recordResponse = (isCorrect: boolean, responseTime: number) => {
        state.session.responseTimes.push(responseTime)

        if (isCorrect) {
            state.session.correctCount++
            state.session.score += Math.floor(1000 / responseTime) // 反應越快分數越高
        } else {
            state.session.incorrectCount++
        }

        adjustDifficulty(responseTime, isCorrect)
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
        state.difficulty.frequency = 0.025
        state.difficulty.contrast = 1.0
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
        startSession,
        endSession,
        resetGame,
        recordResponse,
        averageResponseTime,
        accuracy
    }
}
