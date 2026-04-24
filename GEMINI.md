# Gemini 專案分析：Gabor App

## 專案概述

此專案是一個基於 Nuxt.js 的 Web 應用程式，旨在透過科學的 Gabor 斑塊訓練與遊戲化機制提升使用者的視覺感知能力。目前的版本已具備完整的遊戲邏輯、效能優化與數據持久化系統。

### 核心技術

*   **框架:** Nuxt.js (v4.2.2) / Vue.js (v3.5.26)
*   **樣式:** Tailwind CSS (遵循 Material Design 3)
*   **動畫:** GSAP 用于過渡與視覺特效。
*   **音效:** Web Audio API 即時合成 (互動回饋與海浪白噪音)。
*   **圖形:** p5.js (已優化像素級渲染) 用於 Gabor 斑塊。
*   **數據:** LocalStorage 持久化，具備 XP 經驗值與等級系統。

### 架構與流程

*   **使用者流程:** 
    1. `index.vue` (Splash) -> `login.vue` (Auth)
    2. `prepare.vue` (首頁/校準) -> `task/game-grid.vue` (核心遊戲)
    3. `daily-goal.vue` (分析總結/等級成長) -> `streak.vue` (連續天數)
    4. `timer.vue` (放鬆計時/海浪音效) -> `completion.vue` (結束)

*   **關鍵 Composables:**
    *   `useGameState.ts`: 管理單次遊戲狀態與正確率。
    *   `useGamePersistence.ts`: 管理全域 XP、等級、軍階與歷史紀錄 (Singleton)。
    *   `useAudio.ts`: 處理合成音效與沉浸式環境音。
    *   `useAppSettings.ts`: 管理音效開關與深色模式。

*   **遊戲化機制 (Duolingo Style):**
    *   **XP 公式:** 基於訓練時長、分數與每日登入獎勵。
    *   **等級與軍階:** 平方根等級曲線，自動對應「觀察者」到「視覺大師」。
    *   **動態難度:** 遊戲難度（網格大小、對比度、角度差）會隨等級自動調整。

## 開發慣例

*   **效能優化:** `GaborCanvas.vue` 採用手動像素操作以提升渲染效能。
*   **視覺風格:** 嚴格遵循 8px 網格與 MD3 圓角規範。
*   **狀態管理:** 優先使用具備持久化能力的 Singleton Composables。
*   **環境適配:** 提供頂部狀態列間距的條件式過濾 (除 Splash/Login/Prepare 外)。
