# Gabor App (Nuxt)

這是一個使用 [Nuxt.js](https://nuxt.com/) 開發的視覺訓練應用程式。此專案透過科學的 Gabor 斑塊訓練與遊戲化設計，旨在提升使用者的視覺感知能力。

## ✨ 核心功能

*   **動態 Gabor 渲染引擎**: 使用 [p5.js](https://p5js.org/) 搭配像素級優化算法，即時渲染高品質視覺刺激。
*   **遊戲化等級系統 (XP)**: 參考 Duolingo 設計，具備經驗值累計、軍階晉升與**動態難度自適應**功能。
*   **沉浸式音效體驗**: 
    *   互動回饋音：點擊正確/錯誤的即時音效。
    *   海浪白噪音：在放鬆計時頁面使用 Web Audio API 合成的沉浸式背景音。
*   **數據視覺化**: 具備週準確度趨勢圖表與連續達成天數 (Streak) 追蹤。
*   **個人化偏好**: 支援深色模式切換與音效全域開關，具備 LocalStorage 持久化儲存。
*   **現代化的 UI/UX**: 嚴格遵循 Material Design 3 規範，並使用 GSAP 打造流暢的動態體驗。

## 🛠 技術棧

*   **框架**: Nuxt 4, Vue 3 (Composition API)
*   **樣式**: Tailwind CSS
*   **動畫**: GSAP (GreenSock)
*   **音效**: Web Audio API
*   **圖形**: p5.js

## 專案設定與執行

請確保已安裝所有依賴套件：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

建置生產版本：

```bash
npm run build
```

更多詳細資訊請參考 [PRD.md](./PRD.md) 與 [GEMINI.md](./GEMINI.md)。
