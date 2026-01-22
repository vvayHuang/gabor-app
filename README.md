# Gabor App Wireframe Demo (Nuxt)

這是一個使用 [Nuxt.js](https://nuxt.com/) 開發的 Gabor App 線框圖原型專案。此專案旨在模擬一個用於視覺感知研究的應用程式，引導使用者完成一系列基於 Gabor 斑塊的視覺任務。

## ✨ 核心功能

*   **動態 Gabor 斑塊生成**: 使用 [p5.js](https://p5js.org/) 在客戶端動態渲染 Gabor 斑塊，並允許即時調整其參數（如方向、頻率、對比度等）。
*   **流暢的動畫過渡**: 透過 [GSAP](https://gsap.com/) 實現了啟動畫面和頁面之間的平滑動畫效果，提升了使用者體驗。
*   **結構化任務流程**: 包含完整的用戶流程，從啟動、登入、任務準備、網格選擇到最終的完成頁面。
*   **現代化的 UI/UX**: 採用 [Tailwind CSS](https://tailwindcss.com/) 進行樣式設計，並實作了任務進度條、退出確認對話框等現代化的 UI 元件。
*   **基於 Nuxt.js**: 建立在強大的 [Nuxt.js](https://nuxt.com/) 框架之上，具備伺服器端渲染、基於檔案的路由和模組化架構等優點。

## 專案設定

請確保已安裝所有依賴套件：

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## 開發伺服器

啟動開發伺服器，應用程式將運行在 `http://localhost:3000`：

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## 生產環境

建置應用程式以用於生產環境：

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

在本地預覽生產版本的建置成果：

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

更多關於部署的資訊，請參考 [Nuxt 部署文件](https://nuxt.com/docs/getting-started/deployment)。