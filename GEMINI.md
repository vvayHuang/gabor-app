# Gemini 專案分析：Gabor App

## 專案概述

此專案是一個基於 Nuxt.js 的 Web 應用程式，旨在透過科學的 Gabor 斑塊訓練與遊戲化機制提升使用者的視覺感知能力。目前的版本已具備完整的遊戲邏輯、效能優化與數據持久化系統。

### 核心技術

*   **框架:** Nuxt.js (v4.2.2) / Vue.js (v3.5.26)
*   **樣式:** Tailwind CSS (遵循 Material Design 3)
*   **動畫:** GSAP 用于過渡與視覺特效。
*   **音效:** Web Audio API 即時合成 (互動回饋與海浪白噪音)。
*   **圖形:** p5.js (已優化像素級渲染) 用於 Gabor 斑塊。
*   **數據:** Supabase (PostgreSQL) + LocalStorage 雙重同步持久化。

## 科學遊戲機制

### 1. 動態難度引擎 (`useGameState.ts`)
系統根據使用者等級 (Lv.1 - 100) 自動計算任務參數（強化硬核版）：
*   **對比度 (Contrast)**: `Math.pow(0.94, level - 1)` (Lv.100 時降至 ~0.03)。
*   **角度差 (Angle Offset)**: `30 * Math.pow(0.95, level - 1)` (Lv.100 時縮小至 ~2度)。
*   **空間頻率 (Spatial Frequency)**: `0.38 + (level * 0.005)` cycles/mm。
*   **網格規模 (Grid Size)**:
    *   Lv.1+: 3x4
    *   Lv.8+: 4x5
    *   Lv.20+: 5x6
    *   Lv.45+: 6x8

### 2. 視覺多樣性與干擾 (Visual Noise - Hardcore v2)
為模擬真實世界的視覺挑戰，每個斑塊會引入劇烈的隨機擾動：
*   **頻率干擾**: 基礎頻率 +/- 40% 劇烈波動（創造細密與粗大條紋混雜感）。
*   **對比干擾**: 基礎對比度大幅隨機（0.4x ~ 1.3x 波動），產生深淺極端層次。
*   **相位隨機**: 0 ~ 2π 完全隨機偏移，條紋位置不再統一。
*   **角度噪聲**: 干擾項額外具備 +/- 10 度隨機偏轉。
*   **尺寸噪聲**: Sigma 值 +/- 20% 波動。
*   **調色盤**: 使用 `primary: #F9F9FF` (背景色) 與 `secondary: #181C23` (深色) 進行亮度調製，確保高對比度。

### 2. 等級與計分系統
*   **角色等級 (Player Level)**: 基於總 XP 計算，公式為 `floor(sqrt(XP / 100)) + 1`。
*   **成就評等 (Achievement Level)**: 單次遊戲表現評分 (1-5 星)，公式為 `floor(分數 / 500) + 1`。
*   **速度獎金**: `max(0, 400 - (反應時間 / 10))`。

## 數據架構 (Supabase)

### `public.game_stats` (長期統計)
*   `user_id`: UUID (Primary Key)
*   `total_xp`: 累積經驗值
*   `current_level`: 目前角色等級
*   `high_score`: 歷史最高分
*   `total_sessions`: 總訓練次數
*   `current_streak`: 目前連續天數
*   `achievements`: JSONB (紀錄每日最高成就評等)

### `public.game_sessions` (單次紀錄)
*   紀錄每場遊戲的 `score`, `accuracy`, `avg_response_time`, `correct_count`, `incorrect_count` 等詳細數據。

## UI/UX 開發慣例

### 1. 設計系統與樣式
*   **MD3 規範**: 嚴格遵循 Material Design 3 Tokens，使用 `rounded-3xl` (XL 容器) 或 `rounded-2xl`。
*   **去卡片化 (Minimalism)**: 個人資料頁面優先採用「純文字 + 標題區塊」佈局，避免過多嵌套卡片。
*   **指標佈局**: 
    *   **分析報告**: 統一使用三欄式 (Grid-cols-3) 展示成功率、時間、反應速度。
    *   **個人資料**: 數據概覽採用二欄式文字清單，並將進度條整合進網格末端。

### 2. 效能與圖形架構 (Hybrid Rendering)
*   **核心訓練 (Gabor)**: `GaborCanvas.vue` **必須使用原生 Canvas ImageData 操作**。嚴禁使用 p5.js 或任何會觸發 `willReadFrequently` 警告的庫進行核心渲染。目標是 60 FPS 與醫學級精確度。
*   **視覺裝飾 (Generative Art)**: 使用 **p5.js** 處理背景、過場動畫與成就視覺化。利用其強大的噪聲 (Perlin Noise) 與數學函式庫實現生成式藝術。
*   **資源路徑**: 所有靜態 SVG 勳章必須存放在 `public/shape/` 下。

### 3. 環境適配
*   **狀態列避讓**: 提供頂部狀態列間距的條件式過濾 (除 Splash/Login/Prepare 外)。
*   **對比度要求**: 文字顏色優先使用 `text-on-surface` 或 `text-on-surface-variant` (不建議加透明度)，確保符合 WCAG 2.1 標準。

## 行動裝置環境適配 (Mobile / Capacitor)

### 1. 認證系統與 Deep Link (iOS)
為解決原生 Webview 環境下 OAuth 跳轉狀態遺失的問題，實施了以下架構：
*   **URL Scheme**: `gaborapp://` (Xcode Info.plist 已註冊)。
*   **Redirect URL**: `gaborapp://login-callback` (已同步至 Supabase Auth 設定)。
*   **OAuth 流程**: 強制使用 **隱式流程 (Implicit Flow)** 與 `flowType: 'implicit'`，以規避 PKCE 流程在模擬器環境下遺失 `code_verifier` 的報錯。
*   **身分持久化備援**: 
    *   在 `login.vue` 接收到 Token 後，手動寫入 `sb-ickdtelqtjifjkledtjw-auth-token` 格式之 Cookie。
    *   使用 `window.location.href` 執行硬跳轉，強迫 Webview 重新載入以觸發 Supabase 的 Cookie 偵測邏輯。

### 2. 開發調試與已知限制
*   **模擬器 Storage 隔離**: 目前 iOS 模擬器在硬跳轉後有時仍會丟失 Session，建議優先使用實體機測試，或未來引入 `@capacitor/preferences` 進行人工 Session 管理。
*   **同步指令**: 務必確保在程式碼變更後執行 `npm run generate && npx cap sync ios`。
