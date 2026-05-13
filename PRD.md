# 產品需求文件 (PRD)：Gabor App

## 1. 專案概述 (Project Overview)

*   **產品名稱**：Gabor App
*   **產品定位**：這是一款基於科學研究（Gabor 斑塊）的視覺訓練應用程式，旨在透過互動式任務提升使用者的視覺感知能力與專注力。
*   **專案現況**：正式開發階段，專注於核心功能實現、性能優化與高品質的 UI/UX 體驗。

## 2. 目標族群 (Target Audience)

1.  **專注力提升者**：希望透過日常小練習改善視覺專注力的使用者。
2.  **視覺研究參與者**：參與相關視覺研究或復健訓練的人員。
3.  **科技愛好者**：追求流暢動效與現代化介面體驗的 App 使用者。

## 3. 核心功能與使用者流程 (Core Features & User Flow)

### 3.1 使用者流程
1.  **啟動畫面 (Splash)**：展示品牌識別與流暢的過場動畫（GSAP 驅動）。
2.  **身分驗證 (Auth)**：簡潔的登入介面，支援第三方登入 (Google/Apple)。
3.  **每日目標與引導 (Daily Goal & Tutorial)**：設定今日訓練目標並提供基礎操作教學。
4.  **準備階段 (Prepare)**：視覺校準與心理準備。
5.  **核心訓練 (Task Grid)**：在任務網格中尋找並互動特定的 Gabor 斑塊。
6.  **任務完成 (Completion)**：展示訓練成果、連續達標天數 (Streak) 並提供成就回饋。
7.  **紀錄與設定 (Records & Settings)**：追蹤歷史數據與自訂 App 表現。

### 3.2 關鍵功能模組
*   **Gabor 渲染引擎**：使用**原生 Canvas API (ImageData)** 實現高性能、醫學級精確度的 Gabor 斑塊生成。
*   **生成式視覺系統**：使用 `p5.js` 打造動態生成式背景與藝術回饋，提升 App 藝術質感。
*   **進度追蹤系統**：視覺化的進度條與環形指示器，讓使用者即時掌握任務狀態。
*   **動態狀態管理**：透過 Composable (`useGameState`) 管理訓練中的狀態切換與數據持久化。

## 4. 技術架構 (Technical Stack)

*   **前端框架**：Nuxt 3 (Nuxt 4.2.2) + Vue 3 (Composition API)。
*   **樣式處理**：Tailwind CSS (遵循 Material Design 3 Tokens 命名)。
*   **動畫庫**：GSAP (GreenSock Animation Platform)。
*   **核心渲染**：原生 Canvas API (用於 Gabor 斑塊)。
*   **藝術渲染**：p5.js (用於生成式藝術與動態背景)。
*   **圖示系統**：Nuxt Icon (統一使用 SVG 元件)。
*   **字體方案**：Google Fonts - Noto Sans TC (確保繁體中文呈現品質)。

## 5. 設計準則 (Design Guidelines)

### 5.1 視覺風格
*   **原子設計 (Atomic Design)**：元件拆解至 Atoms (IconButton, Switch) 到 Organisms (NavigationBar, TaskHeader)。
*   **Material Design 3**：遵循 MD3 的色調系統、間距與元件行為。
*   **8px 網格系統**：所有間距與元件尺寸均以 8px 為基準。

### 5.2 互動體驗
*   **Mobile-first**：優先針對行動裝置觸控體驗進行優化。
*   **回饋機制**：按鈕點擊、任務成功/失敗均需有明確的視覺回饋。
*   **無障礙 (A11y)**：符合 WCAG 2.1 標準，確保文字對比度與操作直覺性。

## 6. 功能需求清單 (Functional Requirements)

| 編號 | 功能名稱 | 描述 | 優先級 |
| :--- | :--- | :--- | :--- |
| F01 | Gabor 視覺化 | 確保 Gabor 斑塊在畫布上能根據 Composable 參數正確渲染。 | P0 (最高) |
| F02 | 狀態流轉控制 | 完整實現從 Prepare -> Game -> Completion 的狀態跳轉。 | P0 |
| F03 | 數據持久化 | 使用 LocalStorage 紀錄使用者的訓練歷史與 Streak。 | P1 |
| F04 | 動畫過場 | 實現頁面切換與任務互動間的流暢銜接。 | P1 |
| F05 | 響應式配置 | 確保在不同尺寸的手機螢幕上皆能正確顯示。 | P1 |

## 7. 非功能需求 (Non-Functional Requirements)

*   **性能要求**：Gabor 畫布渲染需穩定在 60 FPS，避免視覺延遲影響訓練結果。
*   **安全性**：前端狀態不應洩漏使用者敏感資訊。
*   **擴充性**：元件需具備高度 Props 配置化，以便未來新增不同類型的視覺任務。

## 8. 未來展望 (Future Roadmap)

*   **數據分析面板**：將紀錄頁面轉化為具備圖表分析的深度追蹤工具。
*   **遊戲化機制**：引入更多的成就徽章與等級系統。
*   **雲端同步**：整合後端服務 (如 Supabase)，實現多裝置數據同步。
