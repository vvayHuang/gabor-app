# Gabor App Design System (GDS)

## 1. 視覺語調與核心理念 (Tone & Philosophy)

Gabor App 旨在透過科學訓練提升視覺能力。其設計系統遵循 **「科學極簡主義 (Scientific Minimalism)」**，強調專注、精確與流暢的數位體驗。

*   **專注 (Focus)**：移除所有不必要的視覺噪音，讓使用者能全神貫注於 Gabor 斑塊訓練。
*   **精確 (Precision)**：UI 元素需具備明確的物理感，色彩與對比度需符合視覺訓練的科學標準。
*   **流暢 (Fluidity)**：透過微動效 (Micro-interactions) 提供即時且滑順的互動回饋。

---

## 2. 色彩系統 (Color System)

本專案採用 **Material Design 3 (MD3)** 調色盤，並針對高對比需求進行優化。

### 基礎色調 (Base Tones)
*   **Background / Surface**：`#F9F9FF` (極淺藍灰) - 提供清爽、具專業感的背景。
*   **On-Background / On-Surface**：`#181C23` (深藍黑) - 確保文字與 Gabor 斑塊在背景上具備最高辨識度。

### 品牌亮點 (Brand Accents)
*   **Primary**：`#005BAF` - 用於主要按鈕、重要標籤與進度指示。
*   **Secondary**：`#3F5F8F` - 用於次要操作與裝飾性元素。
*   **Tertiary**：`#8A31AE` - 用於成就、等級提升與特殊回饋。
*   **Error**：`#BA1A1A` - 用於警告、錯誤提示與訓練失敗狀態。

---

## 3. 字體與排版 (Typography)

統一使用 **Noto Sans TC**，確保在各種螢幕上皆具備極佳的易讀性。

| 類別 | 用途 | 規格範例 |
| :--- | :--- | :--- |
| **Display** | 大標題、等級數值 | `57px`, `700` (Bold) |
| **Headline** | 頁面標題、區塊標題 | `32px`, `700` (Bold) |
| **Title** | 卡片標題、清單標題 | `22px`, `500` (Medium) |
| **Body** | 說明文字、內容正文 | `16px`, `400` (Regular) |
| **Label** | 按鈕文字、小標籤 | `14px`, `500` (Medium) |

---

## 4. 網格與空間佈局 (Grid & Spacing)

*   **8px 網格系統**：所有間距 (Padding/Margin) 必須是 8 的倍數 (8, 16, 24, 32, 48...)。
*   **Mobile-First 限制**：
    *   桌面端最大容器寬度：`440px`。
    *   頁面兩側邊距 (Horizontal Margin)：`24px`。
*   **狀態列避讓**：頂部預留 `62px` (StatusBar) 間距。

---

## 5. 組件規範 (Component Standards)

### 按鈕 (Buttons)
*   **Filled (Primary)**：用於核心路徑 (例如：開始訓練)。
*   **Outlined**：用於次要操作。
*   **IconButton**：圓形容器，內部圖示大小為 `24px`。
*   **圓角 (Radius)**：統一使用 `rounded-full` (藥丸型)。

### 卡片與容器 (Cards)
*   **大型容器**：`rounded-3xl` (例如：主任務區塊)。
*   **中型卡片**：`rounded-2xl` (例如：統計數據卡)。
*   **陰影 (Shadow)**：預設使用 `shadow-sm`，僅在懸浮或強調時使用 `shadow-md`。

### 訓練畫布 (Gabor Canvas)
*   **背景色**：必須與 `surface` 顏色對齊。
*   **線條色**：由動態對比度引擎決定，通常為 `on-surface`。

---

## 6. 動畫哲學 (Motion Philosophy)

使用 **GSAP** 確保動作的物理自然感。

*   **過渡 (Transitions)**：
    *   進入動畫：`duration: 0.8`, `ease: "power2.out"`。
    *   退出動畫：`duration: 0.5`, `ease: "power2.inOut"`。
*   **互動回饋 (Feedback)**：
    *   按鈕點擊：`scale: 0.95` 立即回饋，隨後恢復原狀。
    *   成就顯示：使用彈跳效果 (Bounce ease) 增加喜悅感。

---

## 7. 生成式藝術 (Generative Art)

*   **p5.js 角色**：負責頁面背景的有機流動、過場的雜訊效果與非精確性的視覺裝飾。
*   **風格**：低飽和度、隨機性 (Perlin Noise)、有機幾何形狀。
