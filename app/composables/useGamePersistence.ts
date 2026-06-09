import { ref, watch, computed } from 'vue'

export interface GameSessionData {
    id?: string
    score: number
    accuracy: number
    correct_count: number
    incorrect_count: number
    avg_response_time: number
    total_time_ms: number
    created_at?: string
}

export interface GameStats {
    highScore: number
    consecutiveDays: number
    totalTimeMinutes: number
    totalXP: number
    totalSessions: number
    lastPlayedDate: string
    currentStreak: number
    achievements: Record<string, string> // YYYY-MM-DD -> 'level-1' to 'level-5'
    recentSessions: GameSessionData[]
}

const STORAGE_KEY = 'gabor_game_stats'

// Singleton State
const stats = ref<GameStats>({
    highScore: 0,
    consecutiveDays: 0,
    totalTimeMinutes: 0,
    totalXP: 0,
    totalSessions: 0,
    lastPlayedDate: '',
    currentStreak: 0,
    achievements: {},
    recentSessions: []
})

const isLoaded = ref(false)

export function useGamePersistence() {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const loadStats = async () => {
        if (typeof window === 'undefined' || isLoaded.value) return

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                stats.value = {
                    ...stats.value,
                    ...parsed,
                    totalXP: parsed.totalXP || 0,
                    achievements: parsed.achievements || {},
                    recentSessions: parsed.recentSessions || []
                }
            } catch (e) {
                console.error('Failed to parse game stats:', e)
            }
        }

        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
            await Promise.all([
                fetchFromCloud(currentUser.id),
                fetchSessionHistory(currentUser.id)
            ])
        }

        isLoaded.value = true
    }

    const fetchFromCloud = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('game_stats')
                .select(`*`)
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            if (data) {
                stats.value = {
                    ...stats.value,
                    highScore: data.high_score || 0,
                    consecutiveDays: data.consecutive_days || 0,
                    totalTimeMinutes: data.total_time_minutes || 0,
                    totalXP: data.total_xp || 0,
                    totalSessions: data.total_sessions || 0,
                    lastPlayedDate: data.last_played_date || '',
                    currentStreak: data.current_streak || 0,
                    achievements: data.achievements || {}
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
            }
        } catch (e) {
            console.error('Error fetching stats from cloud:', e)
        }
    }

    const fetchSessionHistory = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('game_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50) // 增加抓取量以利趨勢計算

            if (error) throw error

            if (data) {
                stats.value.recentSessions = data.map(s => ({
                    id: s.id,
                    score: s.score,
                    accuracy: s.accuracy,
                    correct_count: s.correct_count,
                    incorrect_count: s.incorrect_count,
                    avg_response_time: s.avg_response_time,
                    total_time_ms: s.total_time_ms,
                    created_at: s.created_at
                }))
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
            }
        } catch (e) {
            console.error('Error fetching session history:', e)
        }
    }

    const recordSession = async (sessionData: GameSessionData) => {
        // 先更新本地狀態（樂觀更新）
        const tempSession = { ...sessionData, created_at: new Date().toISOString() }
        stats.value.recentSessions = [tempSession, ...stats.value.recentSessions].slice(0, 50)
        stats.value.totalSessions++
        
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (currentUser) {
            try {
                const { error } = await supabase
                    .from('game_sessions')
                    .insert({
                        user_id: currentUser.id,
                        score: sessionData.score,
                        accuracy: sessionData.accuracy,
                        correct_count: sessionData.correct_count,
                        incorrect_count: sessionData.incorrect_count,
                        avg_response_time: sessionData.avg_response_time,
                        total_time_ms: sessionData.total_time_ms
                    })
                if (error) throw error
            } catch (e) {
                console.error('Error recording session to cloud:', e)
            }
        }
        
        return saveStats()
    }

    const saveStats = async () => {
        if (typeof window === 'undefined') return

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))

        const { data: { user: currentUser } } = await supabase.auth.getUser()

        if (currentUser) {
            try {
                const payload = {
                    user_id: currentUser.id,
                    high_score: stats.value.highScore,
                    consecutive_days: longestStreak.value,
                    total_time_minutes: stats.value.totalTimeMinutes,
                    total_xp: stats.value.totalXP,
                    total_sessions: stats.value.totalSessions,
                    current_level: currentLevel.value,
                    current_streak: stats.value.currentStreak,
                    achievements: stats.value.achievements,
                    last_played_date: stats.value.lastPlayedDate,
                    updated_at: new Date().toISOString()
                }
                
                const { error } = await supabase
                    .from('game_stats')
                    .upsert(payload, { onConflict: 'user_id' })
                
                if (error) throw error
            } catch (e) {
                console.error('Error saving stats to cloud:', e)
            }
        }
    }

    const currentLevel = computed(() => Math.floor(Math.sqrt(stats.value.totalXP / 100)) + 1)

    const levelProgress = computed(() => {
        const lvl = currentLevel.value
        const xpForCurrent = Math.pow(lvl - 1, 2) * 100
        const xpForNext = Math.pow(lvl, 2) * 100
        const range = xpForNext - xpForCurrent
        const progress = stats.value.totalXP - xpForCurrent
        return Math.min(100, Math.max(0, (progress / range) * 100))
    })

    const longestStreak = computed(() => {
        const achievementDates = Object.keys(stats.value.achievements || {}).sort()
        if (achievementDates.length === 0) return stats.value.consecutiveDays

        let longest = 1
        let current = 1

        for (let i = 1; i < achievementDates.length; i++) {
            const previousDate = new Date(`${achievementDates[i - 1]}T00:00:00`)
            const currentDate = new Date(`${achievementDates[i]}T00:00:00`)
            const diffDays = Math.round((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24))

            if (diffDays === 1) {
                current++
                longest = Math.max(longest, current)
            } else if (diffDays > 1) {
                current = 1
            }
        }

        return longest
    })

    const rankName = computed(() => {
        const lvl = currentLevel.value
        if (lvl >= 60) return '視覺大師'
        if (lvl >= 30) return '鷹之眼'
        if (lvl >= 10) return '探險家'
        return '觀察者'
    })

    const addXP = async (amount: number) => {
        stats.value.totalXP += Math.round(amount)
        return saveStats()
    }

    const recordAchievement = async (level: number) => {
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
        
        // 降低成就 XP：每個級別 10 XP
        await addXP(level * 10) 
        return saveStats()
    }

    const updateHighScore = async (score: number) => {
        if (score > stats.value.highScore) {
            stats.value.highScore = score
        }
        // 大幅降低分數轉換 XP：從 0.5 降至 0.05
        // 例如 2000 分只給 100 XP，比較合理
        await addXP(score * 0.05)
        return saveStats()
    }

    const updateConsecutiveDays = async () => {
        const today = new Date().toISOString().split('T')[0]
        const lastPlayed = stats.value.lastPlayedDate

        if (!lastPlayed) {
            stats.value.currentStreak = 1
            stats.value.consecutiveDays = Math.max(stats.value.consecutiveDays, stats.value.currentStreak)
            await addXP(50)
        } else {
            const lastDate = new Date(lastPlayed)
            const todayDate = new Date(today)
            
            const diffTime = todayDate.getTime() - lastDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) return
            
            if (diffDays === 1) {
                stats.value.currentStreak++
                stats.value.consecutiveDays = Math.max(stats.value.consecutiveDays, stats.value.currentStreak)
                await addXP(30)
            } else {
                stats.value.currentStreak = 1
                stats.value.consecutiveDays = Math.max(stats.value.consecutiveDays, stats.value.currentStreak)
            }
        }

        stats.value.lastPlayedDate = today
        return saveStats()
    }

    const addTrainingTime = async (milliseconds: number) => {
        const minutes = Math.max(1, Math.floor(milliseconds / 60000))
        stats.value.totalTimeMinutes += minutes
        await addXP(minutes * 10)
        return saveStats()
    }

    const resetStats = async () => {
        stats.value = {
            highScore: 0,
            consecutiveDays: 0,
            totalTimeMinutes: 0,
            totalXP: 0,
            totalSessions: 0,
            lastPlayedDate: '',
            currentStreak: 0,
            achievements: {},
            recentSessions: []
        }
        return saveStats()
    }

    return {
        stats,
        currentLevel,
        levelProgress,
        longestStreak,
        rankName,
        loadStats,
        saveStats,
        recordSession,
        recordAchievement,
        updateHighScore,
        updateConsecutiveDays,
        addTrainingTime,
        resetStats
    }
}
