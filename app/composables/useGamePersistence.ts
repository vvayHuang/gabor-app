import { ref, watch, computed } from 'vue'

export interface GameStats {
    highScore: number
    consecutiveDays: number
    totalTimeMinutes: number
    totalXP: number // 新增：總經驗值
    lastPlayedDate: string
    currentStreak: number
    achievements: Record<string, string> // YYYY-MM-DD -> 'level-1' to 'level-5'
}

const STORAGE_KEY = 'gabor_game_stats'

// Singleton State: 確保所有頁面共用同一份數據
const stats = ref<GameStats>({
    highScore: 0,
    consecutiveDays: 0,
    totalTimeMinutes: 0,
    totalXP: 0,
    lastPlayedDate: '',
    currentStreak: 0,
    achievements: {}
})

const isLoaded = ref(false)

export function useGamePersistence() {
    // Load from localStorage
    const loadStats = () => {
        if (typeof window === 'undefined' || isLoaded.value) return

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                stats.value = {
                    ...stats.value,
                    ...parsed,
                    totalXP: parsed.totalXP || 0,
                    achievements: parsed.achievements || {}
                }
            } catch (e) {
                console.error('Failed to parse game stats:', e)
            }
        }
        isLoaded.value = true
    }

    // Save to localStorage
    const saveStats = () => {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
    }

    // --- 等級運算 (Duolingo Style) ---
    
    // 等級公式：Level = floor(sqrt(XP / 100)) + 1
    // 這代表等級越高，下一級所需的 XP 越多
    const currentLevel = computed(() => Math.floor(Math.sqrt(stats.value.totalXP / 100)) + 1)

    // 計算當前等級的進度百分比 (用於進度條)
    const levelProgress = computed(() => {
        const lvl = currentLevel.value
        const xpForCurrent = Math.pow(lvl - 1, 2) * 100
        const xpForNext = Math.pow(lvl, 2) * 100
        const range = xpForNext - xpForCurrent
        const progress = stats.value.totalXP - xpForCurrent
        return Math.min(100, Math.max(0, (progress / range) * 100))
    })

    // 軍階名稱對照
    const rankName = computed(() => {
        const lvl = currentLevel.value
        if (lvl >= 60) return '視覺大師'
        if (lvl >= 30) return '鷹之眼'
        if (lvl >= 10) return '探險家'
        return '觀察者'
    })

    // --- 數據更新 ---

    // 增加 XP (基於表現)
    const addXP = (amount: number) => {
        stats.value.totalXP += Math.round(amount)
        saveStats()
    }

    const recordAchievement = (level: number) => {
        const today = new Date().toISOString().split('T')[0]
        const levelKey = `level-${Math.min(5, Math.max(1, level))}`
        
        const existingLevel = stats.value.achievements[today]
        if (existingLevel) {
            const existingNum = parseInt(existingLevel.split('-')[1])
            if (level > existingNum) {
                stats.value.achievements[today] = levelKey
            }
        } else {
            stats.value.achievements[today] = levelKey
        }
        
        // 每次完成訓練，依據達成等級給予 XP 獎勵
        addXP(level * 20) 
        saveStats()
    }

    const updateHighScore = (score: number) => {
        if (score > stats.value.highScore) {
            stats.value.highScore = score
            saveStats()
        }
        // 分數也轉換為少量 XP
        addXP(score * 0.5)
    }

    const updateConsecutiveDays = () => {
        const today = new Date().toISOString().split('T')[0]
        const lastPlayed = stats.value.lastPlayedDate

        if (!lastPlayed) {
            stats.value.consecutiveDays = 1
            stats.value.currentStreak = 1
            addXP(50) // 首次獎勵
        } else {
            const lastDate = new Date(lastPlayed)
            const todayDate = new Date(today)
            const diffTime = todayDate.getTime() - lastDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) return
            
            if (diffDays === 1) {
                stats.value.consecutiveDays++
                stats.value.currentStreak++
                addXP(30) // 連續登入獎勵
            } else {
                stats.value.currentStreak = 1
            }
        }

        stats.value.lastPlayedDate = today
        saveStats()
    }

    const addTrainingTime = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000)
        stats.value.totalTimeMinutes += minutes
        // 每訓練一分鐘給 10 XP
        addXP(minutes * 10)
        saveStats()
    }

    const resetStats = () => {
        stats.value = {
            highScore: 0,
            consecutiveDays: 0,
            totalTimeMinutes: 0,
            totalXP: 0,
            lastPlayedDate: '',
            currentStreak: 0,
            achievements: {}
        }
        saveStats()
    }

    return {
        stats,
        currentLevel,
        levelProgress,
        rankName,
        loadStats,
        saveStats,
        recordAchievement,
        updateHighScore,
        updateConsecutiveDays,
        addTrainingTime,
        resetStats
    }
}
