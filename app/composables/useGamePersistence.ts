import { ref, watch } from 'vue'

export interface GameStats {
    highScore: number
    consecutiveDays: number
    totalTimeMinutes: number
    lastPlayedDate: string
    currentStreak: number
    achievements: Record<string, string> // YYYY-MM-DD -> 'level-1' to 'level-5'
}

const STORAGE_KEY = 'gabor_game_stats'

export function useGamePersistence() {
    const stats = ref<GameStats>({
        highScore: 0,
        consecutiveDays: 0,
        totalTimeMinutes: 0,
        lastPlayedDate: '',
        currentStreak: 0,
        achievements: {}
    })

    // Load from localStorage
    const loadStats = () => {
        if (typeof window === 'undefined') return

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                stats.value = {
                    ...stats.value,
                    ...parsed,
                    achievements: parsed.achievements || {}
                }
            } catch (e) {
                console.error('Failed to parse game stats:', e)
            }
        }
    }

    // Save to localStorage
    const saveStats = () => {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
    }

    // Record Achievement Level
    const recordAchievement = (level: number) => {
        const today = new Date().toISOString().split('T')[0]
        const levelKey = `level-${Math.min(5, Math.max(1, level))}`
        
        // 如果今天已經有紀錄，保留最高等級
        const existingLevel = stats.value.achievements[today]
        if (existingLevel) {
            const existingNum = parseInt(existingLevel.split('-')[1])
            if (level > existingNum) {
                stats.value.achievements[today] = levelKey
            }
        } else {
            stats.value.achievements[today] = levelKey
        }
        saveStats()
    }

    // Update high score
    const updateHighScore = (score: number) => {
        if (score > stats.value.highScore) {
            stats.value.highScore = score
            saveStats()
        }
    }

    // Update consecutive days
    const updateConsecutiveDays = () => {
        const today = new Date().toISOString().split('T')[0]
        const lastPlayed = stats.value.lastPlayedDate

        if (!lastPlayed) {
            // First time playing
            stats.value.consecutiveDays = 1
            stats.value.currentStreak = 1
        } else {
            const lastDate = new Date(lastPlayed)
            const todayDate = new Date(today)
            const diffTime = todayDate.getTime() - lastDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) {
                // Same day, no change
                return
            } else if (diffDays === 1) {
                // Consecutive day
                stats.value.consecutiveDays++
                stats.value.currentStreak++
            } else {
                // Streak broken
                stats.value.currentStreak = 1
            }
        }

        stats.value.lastPlayedDate = today
        saveStats()
    }

    // Add training time
    const addTrainingTime = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000)
        stats.value.totalTimeMinutes += minutes
        saveStats()
    }

    // Reset all stats
    const resetStats = () => {
        stats.value = {
            highScore: 0,
            consecutiveDays: 0,
            totalTimeMinutes: 0,
            lastPlayedDate: '',
            currentStreak: 0
        }
        saveStats()
    }

    // Auto-save on changes
    watch(stats, saveStats, { deep: true })

    return {
        stats,
        loadStats,
        saveStats,
        recordAchievement,
        updateHighScore,
        updateConsecutiveDays,
        addTrainingTime,
        resetStats
    }
}
