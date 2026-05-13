# Gabor App (Nuxt)

這是一個使用 [Nuxt.js](https://nuxt.com/) 開發的視覺訓練應用程式。此專案透過科學的 Gabor 斑塊訓練與遊戲化設計，旨在提升使用者的視覺感知能力。

## ✨ 核心功能

*   **高性能 Gabor 渲染引擎**: 使用**原生 Canvas API (ImageData)** 搭配像素級優化算法，實現醫學級精確度的視覺刺激。徹底解決 Readback 效能瓶頸，確保穩定 60 FPS 渲染。
*   **生成式藝術背景 (Generative Art)**: 整合 [p5.js](https://p5js.org/) 打造流體動力學與噪聲藝術背景，將科學訓練轉化為具備「禪意」的視覺體驗。
*   **科學級視覺訓練**: 透過劇烈的視覺噪聲（頻率、相位、對比度隨機擾動），訓練大腦從複雜背景中精確提取「方向特徵」，提升視覺感知處理效能。
*   **遊戲化等級系統 (XP)**: 參考 Duolingo 設計，具備經驗值累計、軍階晉升與**高強度難度自適應**功能。
*   **沉浸式音效體驗**: 
    *   互動回饋音：點擊正確/錯誤的即時音效。
    *   海浪白噪音：在放鬆計時頁面使用 Web Audio API 合成的沉浸式背景音。
*   **數據視覺化**: 具備週準確度趨勢圖表與連續達成天數 (Streak) 追蹤。
*   **個人化偏好**: 支援深色模式切換與音效全域開關，具備 LocalStorage 持久化儲存。
*   **現代化的 UI/UX**: 嚴格遵循 Material Design 3 規範，並使用 GSAP 打造流暢的動態體驗。

## 🛠 技術棧

*   **框架**: Nuxt 4, Vue 3 (Composition API)
*   **樣式**: Tailwind CSS
*   **核心渲染**: 原生 Canvas API
*   **藝術渲染**: p5.js
*   **動畫**: GSAP (GreenSock)
*   **音效**: Web Audio API

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
