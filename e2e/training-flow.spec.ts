import { test, expect, type Page } from '@playwright/test'

const QUESTIONS_PER_STAGE = 5
const STATS_KEY = 'gabor_game_stats'

// Same format as localDateKey() in app/utils/date.ts: the local date, not the UTC one
const localDateKey = () => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// Answers one stage by always picking the first cell. Each question accepts a single
// answer whether it is right or wrong (D02), so the flow does not depend on finding the target.
const answerStage = async (page: Page) => {
    const firstCell = page.getByRole('group', { name: '符號網格' }).getByRole('button').first()
    for (let i = 0; i < QUESTIONS_PER_STAGE; i++) {
        // click() waits until the entrance animation has finished and input is enabled
        await firstCell.click()
        // the grid locks until the next question is ready, so the next click cannot land on this one
        await expect(firstCell).toHaveClass(/pointer-events-none/)
    }
}

test('completes a game, shows the results and saves them', async ({ page }) => {
    await page.goto('/task/game-grid')

    // A new player starts at difficulty 1: a 3×4 grid
    const grid = page.getByRole('group', { name: '符號網格' })
    await expect(grid.getByRole('button')).toHaveCount(12)

    // The grid has to fit the viewport without horizontal scrolling
    const viewport = page.viewportSize()!
    const box = (await grid.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)

    await answerStage(page)

    await expect(page.getByRole('heading', { name: '第一階段完成' })).toBeVisible()
    await page.getByRole('button', { name: '開始' }).click()

    await answerStage(page)

    // Results page
    await page.waitForURL('**/daily-goal')
    await expect(page.getByRole('heading', { name: '分析報告' })).toBeVisible()
    await expect(page.getByText('訓練難度')).toBeVisible()
    await expect(page.getByRole('link', { name: '繼續' }).or(page.getByRole('button', { name: '繼續' }))).toBeVisible()

    // Saved to LocalStorage
    const stats = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || 'null'), STATS_KEY)
    expect(stats).not.toBeNull()
    expect(stats.totalSessions).toBe(1)
    expect(stats.recentSessions).toHaveLength(1)
    const session = stats.recentSessions[0]
    expect(session.correct_count + session.incorrect_count).toBe(QUESTIONS_PER_STAGE * 2)
    expect(stats.highScore).toBe(session.score)
    expect(stats.totalXP).toBeGreaterThan(0)
    expect(stats.totalTimeMinutes).toBeGreaterThanOrEqual(1)
    expect(stats.currentStreak).toBe(1)
    expect(stats.lastPlayedDate).toBe(localDateKey())
    expect(Object.keys(stats.achievements)).toEqual([localDateKey()])
    expect(stats.difficultyLevel).toBeGreaterThanOrEqual(1)
    expect(stats.difficultyLevel).toBeLessThanOrEqual(100)

    // The saved progress is still there after a full reload
    await page.goto('/profile')
    await expect(page.getByText(`${stats.totalXP} XP`)).toBeVisible()
    await expect(page.getByText(`${stats.difficultyLevel} / 100`)).toBeVisible()
})
