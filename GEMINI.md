# Gemini 專案分析：Gabor App Wireframe Demo

## 專案概述

此專案是一個基於 Nuxt.js 的 Web 應用程式，作為「Gabor App」的線框圖（Wireframe）原型。此應用程式旨在引導使用者完成一系列與 Gabor 斑塊（一種用於視覺感知研究的視覺刺激）相關的視覺任務。整個流程包括帶有動畫效果的啟動畫面、登入、準備、具有進度追蹤和退出確認的任務網格，以及完成畫面。

### 核心技術

*   **框架:** [Nuxt.js](https://nuxt.com/) (v4.2.2) 搭配 Vue.js (v3.5.26)
*   **樣式:** [Tailwind CSS](https://tailwindcss.com/)
*   **動畫:** [GSAP (GreenSock Animation Platform)](https://gsap.com/) 用於實現啟動畫面等流暢的過渡動畫。
*   **圖示:** [Nuxt Icon](https://nuxt.com/modules/icon)
*   **字體:** [Nuxt Google Fonts](https://google-fonts.nuxtjs.org/) (使用 Noto Sans TC)
*   **圖形:** [p5.js](https://p5js.org/) 用於在畫布上渲染 Gabor 斑塊的視覺化效果。
*   **套件管理器:** npm

### 架構

*   **結構:** 標準的 Nuxt.js 目錄結構。
*   **路由:** 使用基於檔案的路由系統，頁面位於 `app/pages/` 目錄中。
*   **佈局:** 單一的預設佈局 (`app/layouts/default.vue`) 提供了主要的頁面結構，其中包含一個底部導覽列，該導覽列會根據當前路由有條件地顯示。
*   **元件:** 可重複使用的 UI 元件存放於 `app/components/` 目錄中。
    *   `GaborCanvas.vue`: 透過動態載入 p5.js 僅在客戶端進行渲染，以解決 SSR（伺服器端渲染）問題並實現 Gabor 斑塊的視覺化。
    *   `TaskProgress.vue`: 顯示使用者在任務階段中的進度。
    *   `IconButton.vue`: 用於建立帶有圖示的標準化按鈕。
    *   其他元件包括 `BottomNav.vue`、`ProgressCircle.vue` 等。
*   **狀態管理:** 使用一個簡單的 `composable` (`app/composables/useGaborMock.ts`) 來管理 Gabor 斑塊參數的狀態。

## 建置與執行

### 開發模式

若要在開發模式下執行應用程式並啟用熱重載：

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 上提供服務。

### 生產模式

若要建置用於生產環境的應用程式：

```bash
npm run build
```

若要在本地預覽生產版本的建置成果：

```bash
npm run preview
```

## 開發慣例

*   **樣式:** 專案使用 Tailwind CSS 進行功能優先的樣式設計。自訂的全域樣式位於 `app/assets/css/main.css`。
*   **狀態管理:** 對於簡單的狀態管理，使用 Vue 的 `reactive` 和 `composable` 函式（如 `useGaborMock`）。
*   **圖示:** 所有圖示均應使用 `@nuxt/icon` 提供的 `<Icon />` 元件。避免使用內聯 SVG 或基於字體的圖示。
*   **程式碼格式化:** 雖然 `package.json` 中未明確配置 linter 或 formatter，但程式碼格式一致，表明可能使用了 Prettier 或編輯器的預設格式化工具。建議使用一致的格式化風格。
*   **提交:** 未強制執行正式的提交訊息慣例。