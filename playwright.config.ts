import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    // .cache is already git-ignored, so test artifacts stay out of version control
    outputDir: '.cache/playwright/test-results',
    reporter: 'list',
    // A full game is 10 questions with entrance and feedback animations (about 30–40 s)
    timeout: 120_000,
    // The game state is a singleton per page and both projects share one dev server
    fullyParallel: false,
    workers: 1,
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure'
    },
    projects: [
        { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
        // iPhone SE size: the smallest layout the grid has to fit (B03 / B05)
        { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 375, height: 667 } } }
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000
    }
})
