// 本地時區的 YYYY-MM-DD，作為每日紀錄（achievements / lastPlayedDate）的 key。
// 不可用 toISOString()，那是 UTC 日期，UTC+8 早上 8 點前會落在前一天。
export const localDateKey = (date: Date = new Date()): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

// 兩個日期 key 相差的日曆天數（to - from）。
// 只取年月日做計算，避開 new Date('YYYY-MM-DD') 被解析成 UTC 以及日光節約時間的誤差。
export const diffDateKeys = (from: string, to: string): number => {
    const toDayNumber = (key: string) => {
        const [y, m, d] = key.slice(0, 10).split('-').map(Number)
        return Date.UTC(y!, m! - 1, d!) / (1000 * 60 * 60 * 24)
    }
    return Math.round(toDayNumber(to) - toDayNumber(from))
}
