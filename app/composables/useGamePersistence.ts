import { ref, computed } from 'vue'
import { localDateKey, diffDateKeys } from '~/utils/date'
import type { Database } from '~/types/database.types'

type GameStatsRow = Database['public']['Tables']['game_stats']['Row']

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
// 記錄本機這份統計屬於哪個帳號，切換帳號時才能判斷本地資料是否可沿用
const STORAGE_OWNER_KEY = 'gabor_game_stats_owner'
// 上傳失敗的場次佇列，等下次載入或下一局結算時重送
const PENDING_SESSIONS_KEY = 'gabor_pending_sessions'
const MAX_PENDING_SESSIONS = 50

// 尚未累加到雲端的增量（XP、訓練分鐘、場次）。雲端由 increment_stats RPC 做加法，
// 兩台裝置各自送出自己的增量，才不會像整列 upsert 那樣後存者蓋掉先存者。
const PENDING_DELTA_KEY = 'gabor_pending_stats_delta'

interface StatsDelta {
    xp: number
    minutes: number
    sessions: number
}

const createEmptyDelta = (): StatsDelta => ({ xp: 0, minutes: 0, sessions: 0 })

let pendingDelta: StatsDelta = createEmptyDelta()

const readPendingDelta = (): StatsDelta => {
    try {
        const parsed = JSON.parse(localStorage.getItem(PENDING_DELTA_KEY) || 'null')
        return {
            xp: Number(parsed?.xp) || 0,
            minutes: Number(parsed?.minutes) || 0,
            sessions: Number(parsed?.sessions) || 0
        }
    } catch (e) {
        console.error('Failed to parse pending stats delta:', e)
        return createEmptyDelta()
    }
}

// PostgREST 找不到函式（migration 尚未套用）時的錯誤碼
const FUNCTION_NOT_FOUND = 'PGRST202'

// 佇列中的一筆場次：id 與 created_at 在結算當下就決定，重送時沿用，
// 這樣即使「雲端其實已寫入、只是回應沒收到」，重送也會撞主鍵而不會多一筆。
interface PendingSession {
    id: string
    user_id: string
    score: number
    accuracy: number
    correct_count: number
    incorrect_count: number
    avg_response_time: number
    total_time_ms: number
    created_at: string
}

// Postgres unique_violation：代表這筆 id 已經在雲端，視為上傳成功
const UNIQUE_VIOLATION = '23505'

const readPendingSessions = (): PendingSession[] => {
    try {
        const raw = localStorage.getItem(PENDING_SESSIONS_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? parsed : []
    } catch (e) {
        console.error('Failed to parse pending sessions:', e)
        return []
    }
}

const writePendingSessions = (pending: PendingSession[]) => {
    if (pending.length === 0) {
        localStorage.removeItem(PENDING_SESSIONS_KEY)
    } else {
        localStorage.setItem(PENDING_SESSIONS_KEY, JSON.stringify(pending.slice(-MAX_PENDING_SESSIONS)))
    }
}

// crypto.randomUUID 只在安全來源（https / localhost）可用，其他情況退回用 getRandomValues 組 v4 UUID
const newSessionId = (): string => {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6]! & 0x0f) | 0x40
    bytes[8] = (bytes[8]! & 0x3f) | 0x80
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0'))
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`
}

// 同一時間只跑一輪重送，避免 loadStats 與結算同時觸發而重複上傳
let flushInFlight: Promise<void> | null = null

const createEmptyStats = (): GameStats => ({
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

// Singleton State
const stats = ref<GameStats>(createEmptyStats())

const isLoaded = ref(false)
// 已載入資料所屬的使用者 id（未登入為 null），用來偵測帳號切換
const loadedUserId = ref<string | null>(null)
// 雲端統計是否已成功讀回（含「雲端還沒有資料」的新帳號情境）。
// 沒讀回來就不准 upsert，否則會用空白統計整列覆蓋掉雲端既有紀錄。
const cloudLoaded = ref(false)

export function useGamePersistence() {
    const supabase = useSupabaseClient()
    // 注意：@nuxtjs/supabase v2 的 useSupabaseUser() 回傳的是 JWT claims（JwtPayload），
    // 不是 User 物件，使用者 id 的欄位名稱是 `sub` 而非 `id`。
    const claims = useSupabaseUser()
    const currentUserId = computed(() => claims.value?.sub ?? null)

    // 本機寫入一律連同「擁有者」一起記錄，避免帳號切換後誤用他人資料
    const persistLocal = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
        localStorage.setItem(PENDING_DELTA_KEY, JSON.stringify(pendingDelta))
        const owner = currentUserId.value
        if (owner) {
            localStorage.setItem(STORAGE_OWNER_KEY, owner)
        } else {
            localStorage.removeItem(STORAGE_OWNER_KEY)
        }
    }

    const loadStats = async () => {
        if (typeof window === 'undefined') return

        const userId = currentUserId.value
        // 只有「同一個帳號且已載入過」才可略過；帳號切換時必須重新載入，
        // 否則新帳號會沿用前一位使用者的統計，並在結算時 upsert 覆蓋雲端資料。
        if (isLoaded.value && loadedUserId.value === userId) return

        cloudLoaded.value = false

        const storedOwner = localStorage.getItem(STORAGE_OWNER_KEY)
        const localBelongsToOther = !!userId && !!storedOwner && storedOwner !== userId

        if (localBelongsToOther) {
            // 本機殘留的是別的帳號的資料：先清空，等雲端資料回來再填
            stats.value = createEmptyStats()
            pendingDelta = createEmptyDelta()
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(STORAGE_OWNER_KEY)
            localStorage.removeItem(PENDING_DELTA_KEY)
        } else {
            pendingDelta = readPendingDelta()
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
        }

        if (userId) {
            // 先補傳上次失敗的場次，接著抓回來的歷史紀錄才會包含它們
            await flushPendingSessions(userId)
            await Promise.all([
                fetchFromCloud(userId),
                fetchSessionHistory(userId)
            ])
        }

        loadedUserId.value = userId
        isLoaded.value = true
    }

    // 以雲端資料列為準更新本機；累計值要再加上還沒送出的增量，
    // 否則離線時玩的進度會在下次載入時被雲端的舊數字蓋掉。
    const applyCloudRow = (data: GameStatsRow) => {
        stats.value = {
            ...stats.value,
            highScore: data.high_score || 0,
            consecutiveDays: data.consecutive_days || 0,
            totalTimeMinutes: (data.total_time_minutes || 0) + pendingDelta.minutes,
            totalXP: (data.total_xp || 0) + pendingDelta.xp,
            totalSessions: (data.total_sessions || 0) + pendingDelta.sessions,
            lastPlayedDate: data.last_played_date || '',
            currentStreak: data.current_streak || 0,
            achievements: data.achievements || {}
        }
    }

    const fetchFromCloud = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('game_stats')
                .select(`*`)
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            // PGRST116 = 雲端還沒有這個帳號的資料列，屬於正常的新帳號情境，
            // 一樣視為「已同步」，第一次結算才寫得進去。
            cloudLoaded.value = true

            if (data) {
                applyCloudRow(data)
            } else {
                // 雲端還沒有資料列：本機現有的累計（例如登入前以訪客身分玩的）
                // 全部算作待上傳的增量，第一次存檔時一次加上去。
                pendingDelta = {
                    xp: stats.value.totalXP,
                    minutes: stats.value.totalTimeMinutes,
                    sessions: stats.value.totalSessions
                }
            }
            persistLocal()
        } catch (e) {
            cloudLoaded.value = false
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
                persistLocal()
            }
        } catch (e) {
            console.error('Error fetching session history:', e)
        }
    }

    // 寫入一筆場次；id 已存在（重送撞主鍵）也算成功
    const uploadSession = async (row: PendingSession): Promise<boolean> => {
        try {
            const { error } = await supabase.from('game_sessions').insert(row)
            if (error && error.code !== UNIQUE_VIOLATION) throw error
            return true
        } catch (e) {
            console.error('Error recording session to cloud:', e)
            return false
        }
    }

    // 重送目前帳號的待上傳場次。其他帳號的留在佇列裡，等該帳號下次登入再送。
    const flushPendingSessions = (userId: string): Promise<void> => {
        if (typeof window === 'undefined') return Promise.resolve()
        if (flushInFlight) return flushInFlight

        flushInFlight = (async () => {
            const mine = readPendingSessions().filter(row => row.user_id === userId)
            for (const row of mine) {
                // 一筆失敗就停：多半是還沒連上網，後面的也不會成功
                if (!(await uploadSession(row))) break
                // 每成功一筆就重讀再寫回，避免蓋掉期間新加入佇列的場次
                writePendingSessions(readPendingSessions().filter(item => item.id !== row.id))
            }
        })().finally(() => {
            flushInFlight = null
        })

        return flushInFlight
    }

    // 注意：不在此處呼叫 saveStats()，避免與其他結算函式（updateHighScore 等）
    // 各自觸發重複的 upsert。呼叫端應在所有結算函式跑完後，
    // 自行呼叫一次 saveStats() 統一持久化。
    const recordSession = async (sessionData: GameSessionData) => {
        // 先更新本地狀態（樂觀更新）
        const createdAt = new Date().toISOString()
        const tempSession = { ...sessionData, created_at: createdAt }
        stats.value.recentSessions = [tempSession, ...stats.value.recentSessions].slice(0, 50)
        stats.value.totalSessions++

        const userId = currentUserId.value
        if (userId) pendingDelta.sessions++

        if (userId) {
            const row: PendingSession = {
                id: newSessionId(),
                user_id: userId,
                score: sessionData.score,
                accuracy: sessionData.accuracy,
                correct_count: sessionData.correct_count,
                incorrect_count: sessionData.incorrect_count,
                avg_response_time: sessionData.avg_response_time,
                total_time_ms: sessionData.total_time_ms,
                created_at: createdAt
            }

            if (await uploadSession(row)) {
                // 這一局傳得上去代表網路通了，順便補傳之前失敗的（不擋結算流程）
                void flushPendingSessions(userId)
            } else {
                writePendingSessions([...readPendingSessions(), row])
            }
        }
    }

    const saveStats = async () => {
        if (typeof window === 'undefined') return

        persistLocal()

        const userId = currentUserId.value

        // 雲端資料還沒成功讀回來就不要寫：這時本機的徽章／連續天數可能是空白的，
        // 而且還不知道雲端有沒有資料列，無法判斷本機累計是否該整筆算作增量。
        if (userId && !cloudLoaded.value) {
            console.warn('Skip cloud sync: cloud stats not loaded yet')
            return
        }

        if (userId) {
            // 送出當下的增量快照；等待回應期間若又有新增量，回來後只扣掉已送出的部分
            const sent = { ...pendingDelta }
            try {
                const { data, error } = await supabase.rpc('increment_stats', {
                    p_xp: sent.xp,
                    p_minutes: sent.minutes,
                    p_sessions: sent.sessions,
                    p_high_score: stats.value.highScore,
                    p_longest_streak: longestStreak.value,
                    p_current_streak: stats.value.currentStreak,
                    p_last_played_date: stats.value.lastPlayedDate,
                    p_achievements: stats.value.achievements
                })

                if (error?.code === FUNCTION_NOT_FOUND) {
                    // migration 尚未套用：退回舊的整列 upsert，功能照常但仍有多裝置覆蓋問題
                    console.warn('increment_stats RPC not found, falling back to full-row upsert')
                    await upsertFullRow(userId)
                    return
                }
                if (error) throw error

                pendingDelta = {
                    xp: pendingDelta.xp - sent.xp,
                    minutes: pendingDelta.minutes - sent.minutes,
                    sessions: pendingDelta.sessions - sent.sessions
                }
                if (data) applyCloudRow(data)
                persistLocal()
            } catch (e) {
                console.error('Error saving stats to cloud:', e)
            }
        }
    }

    // increment_stats 不存在時的後備路徑（S01 之前的行為）
    const upsertFullRow = async (userId: string) => {
        const payload = {
            user_id: userId,
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

        // 整列已寫上去，雲端等於本機，沒有待送的增量了
        pendingDelta = createEmptyDelta()
        persistLocal()
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

    // 純本地狀態異動，不觸發網路請求；由呼叫端統一呼叫 saveStats() 持久化
    const addXP = (amount: number) => {
        const xp = Math.round(amount)
        stats.value.totalXP += xp
        if (currentUserId.value) pendingDelta.xp += xp
    }

    const recordAchievement = (level: number) => {
        const today = localDateKey()
        // 徽章與 XP 都用鉗制後的等級，避免高分場次拿到超出徽章上限的 XP
        const cappedLevel = Math.min(5, Math.max(1, level))
        const levelKey = `level-${cappedLevel}`

        const existingLevel = stats.value.achievements[today]
        if (existingLevel) {
            const existingNum = parseInt(existingLevel.split('-')[1])
            if (cappedLevel > existingNum) {
                stats.value.achievements[today] = levelKey
            }
        } else {
            stats.value.achievements[today] = levelKey
        }

        // 降低成就 XP：每個級別 10 XP
        addXP(cappedLevel * 10)
    }

    const updateHighScore = (score: number) => {
        if (score > stats.value.highScore) {
            stats.value.highScore = score
        }
        // 大幅降低分數轉換 XP：從 0.5 降至 0.05
        // 例如 2000 分只給 100 XP，比較合理
        addXP(score * 0.05)
    }

    const updateConsecutiveDays = () => {
        const today = localDateKey()
        const lastPlayed = stats.value.lastPlayedDate

        if (!lastPlayed) {
            stats.value.currentStreak = 1
            stats.value.consecutiveDays = Math.max(stats.value.consecutiveDays, stats.value.currentStreak)
            addXP(50)
        } else {
            const diffDays = diffDateKeys(lastPlayed, today)

            if (diffDays === 0) return

            if (diffDays === 1) {
                stats.value.currentStreak++
                stats.value.consecutiveDays = Math.max(stats.value.consecutiveDays, stats.value.currentStreak)
                addXP(30)
            } else {
                stats.value.currentStreak = 1
                stats.value.consecutiveDays = Math.max(stats.value.consecutiveDays, stats.value.currentStreak)
            }
        }

        stats.value.lastPlayedDate = today
    }

    const addTrainingTime = (milliseconds: number) => {
        const minutes = Math.max(1, Math.floor(milliseconds / 60000))
        stats.value.totalTimeMinutes += minutes
        if (currentUserId.value) pendingDelta.minutes += minutes
        addXP(minutes * 10)
    }

    const resetStats = async () => {
        stats.value = createEmptyStats()
        pendingDelta = createEmptyDelta()
        // 只清本機。雲端改成累加後，這裡不需要也不應該再寫雲端。
        if (typeof window !== 'undefined') persistLocal()
        // 清掉載入旗標，下一位登入的使用者才會真的重新向雲端拉資料
        isLoaded.value = false
        loadedUserId.value = null
        cloudLoaded.value = false
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_OWNER_KEY)
        }
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
