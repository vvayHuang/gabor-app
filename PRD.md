# 產品需求文件 (PRD)：Gabor Patch

> 版本：v2.0（2026-10-07）
> 狀態：MVP 已完成，進入「修正與優化」階段
> 進度（2026-10-07）：P0（B01–B04）、清理（C01–C08）、同步（S01–S03）已完成並 commit；剩餘項目待決策或待實機驗證，見第 7 節各項標記。
> 本文件同時是 Claude Code 的執行清單：第 7 節的每一項都有 ID、範圍、驗收標準，可以逐項交辦。

---

## 1. 產品概述

- **產品名稱**：Gabor Patch（repo：gabor-app）
- **一句話**：每天幾分鐘，在一格一格的 Gabor 斑塊裡找出「角度不一樣的那一個」，用遊戲化的方式訓練視覺對方向與對比的敏感度。
- **平台**：Web（Nuxt 4）＋ iOS（Capacitor 封裝）
- **後端**：Supabase（Google 登入、雲端存檔），LocalStorage 作為離線備援

## 2. 目標使用者

| 族群 | 需求 | 對產品的意義 |
| --- | --- | --- |
| 想養成每日小練習的人 | 短、簡單、有成就感 | Streak、徽章、每日目標要清楚 |
| 對視覺訓練有興趣的人 | 覺得「有科學根據」 | 刺激要精確（清晰、校準、難度合理） |
| 重視體驗的 App 使用者 | 流暢、好看 | 60 FPS、動效一致、深色模式 |

## 3. 產品目標與成功指標

1. **每日回訪**：使用者願意連續多天練習 → 觀察 Streak 分布、7 日留存。
2. **難度剛好**：每局正確率大致落在 70–85%（太簡單會無聊，太難會放棄）。
3. **刺激可信**：在不同裝置上，斑塊清晰、尺寸與頻率一致。
4. **資料不遺失**：換裝置、斷網、切換帳號都不會讓 XP / 紀錄消失或被覆蓋。

## 4. 使用者流程（現況）

```
index（啟動動畫）→ login（Google 登入）→ tutorial（首次教學）
→ prepare（準備）→ task/game-grid（訓練）→ daily-goal（本局結果）
→ streak（連續天數）→ completion
常駐導覽：prepare / records / profile / tutorial / settings（桌機）
```

## 5. 核心機制規格（As-built，作為改動前的基準）

### 5.1 一局的結構
- 一局 = 2 個階段 × 每階段 5 題。
- 每題：網格中只有 1 個目標斑塊與其他斑塊角度不同，點中才算過題；答錯可以重點。
- 第 2 階段使用「目前等級 + 5」的難度參數。

### 5.2 難度引擎（`app/composables/useGameState.ts`）
- `contrast = max(0.03, 0.94^(level-1))`
- `angleOffset = max(2, 30 × 0.95^(level-1))`（度）
- `cyclesPerMm = 0.38 + level × 0.005`
- 網格：3×4 → 4×5（Lv8）→ 5×6（Lv20）→ 6×8（Lv45）
- 每格另有隨機擾動：頻率 ×0.28–0.66、sigma、相位、對比 ×1.0–1.22

### 5.3 分數與等級
- 答對：`100 + max(0, 400 − 反應時間ms/10)`
- XP 來源：分數×0.05、訓練分鐘×10、當日徽章（1–5 級）×10、連續天數 +30（首次 +50）
- `level = floor(sqrt(totalXP/100)) + 1`
- 稱號：觀察者 / 探險家（Lv10）/ 鷹之眼（Lv30）/ 視覺大師（Lv60）

### 5.4 存檔（`app/composables/useGamePersistence.ts`）
- LocalStorage 一律先寫（樂觀更新）；登入時同步 Supabase：
  - `game_stats`：彙總數據（整列 upsert）
  - `game_sessions`：每局紀錄
- 雲端尚未讀回前禁止 upsert（避免空白資料覆蓋雲端）。

### 5.5 不可破壞的技術限制
- `GaborCanvas.vue` 必須用原生 Canvas `ImageData` / `putImageData`，不可改成 p5.js，維持 60 FPS。
- p5.js 只用於裝飾背景（AuthFlowField / TidalWaves / TimeSphere）。
- iOS OAuth：implicit flow、`gaborapp://login-callback`、手動寫入 auth cookie 後硬跳轉 —— 不要動。
- 設計系統：只用 `main.css` 既有 MD3 token，不新增顏色；按鈕 `rounded-full`、卡片 `rounded-2xl`。

## 6. 功能需求總表

| ID | 功能 | 狀態 |
| --- | --- | --- |
| F01 | Gabor 斑塊渲染（原生 Canvas） | ✅ 完成（B04 已依 devicePixelRatio 繪製，待 iPhone 實機確認） |
| F02 | 訓練流程（2 階段 × 5 題 → 結果頁） | ✅ 完成 |
| F03 | 等級 / XP / 稱號 | ✅ 完成，難度設計待討論（D01） |
| F04 | 每日徽章、Streak、行事曆 | ✅ 完成（時區 bug 已於 B01 修正） |
| F05 | Google 登入（Web + iOS deep link） | ✅ 完成 |
| F06 | LocalStorage + Supabase 同步 | ✅ 完成（S01 改為雲端累加、S02 失敗重送；待登入後實測） |
| F07 | 深色模式、音效開關 | ✅ 完成 |
| F08 | 紀錄頁（趨勢圖、行事曆） | ✅ 完成 |
| F09 | 響應式（手機 / 桌機） | ✅ 完成（B03 已修正手機大網格溢出） |
| F10 | 螢幕校準（px/mm） | ❌ 未實作（D03） |
| F11 | 鍵盤 / 無障礙操作 | 🔶 網格可用鍵盤操作並有標籤（C07）；未以螢幕報讀器實測，任務本身仍需視覺辨識 |
| F12 | E2E 測試 | ❌ 已裝 Playwright，未建立設定與測試 |

---

## 7. 改進清單（Claude Code 執行用）

**優先級**：P0 = 會出錯，先修；P1 = 影響體驗；P2 = 清理。
**「需決策」** 的項目會改動既有遊戲設計，**Way 確認方案前不要實作**。
**狀態標記**：✅ 已完成並 commit；🔶 已完成，但仍有驗收項目待實機或登入後確認；⏸ 待決策或待手動處理。

### 7.1 🔴 P0：Bug 修正

#### B01｜每日紀錄的日期用了 UTC，不是本地時間 ✅（`ce0fde7`）
- **問題**：`recordAchievement`、`updateConsecutiveDays` 用 `new Date().toISOString().split('T')[0]` 當「今天」，這是 UTC 日期。台灣早上 8 點前玩會記到前一天；`Calendar.vue` 又用本地日期讀，打卡點錯位、Streak 可能斷掉。`streak.vue` 的 rolling window 也用 `toISOString()`。
- **範圍**：`useGamePersistence.ts`、`pages/streak.vue`（可新增 `app/utils/date.ts`）
- **做法**：新增 `localDateKey(date = new Date())` 回傳本地 `YYYY-MM-DD`；所有「日期 key」改用它。連續天數的天數差用本地日期計算（不要用 `new Date('YYYY-MM-DD')`，它會被解析成 UTC）。
- **驗收**：
  - [x] 在 UTC+8 早上 7 點完成一局，行事曆與 streak 頁都標在「今天」
  - [x] 連續兩天（本地日期）各玩一局，`currentStreak` = 2
  - [x] 既有資料不需遷移（舊 key 照常顯示）— key 格式未變，未用真實舊資料實測

#### B02｜反應時間把進場動畫也算進去 ✅（`56b80b2`）
- **問題**：`generateLevel()` 在進場動畫開始前就設定 `clickStartTime`。進場動畫 = 0.5s + 0.04s ×（格數−1），12 格約 0.9 秒、48 格約 2.4 秒，格子越多速度加分被扣越多。
- **範圍**：`pages/task/game-grid.vue`
- **做法**：在 `playGridEntrance()` 的 tween `onComplete`（並處理 `onInterrupt`）才設定 `clickStartTime`；動畫期間格子不可點擊（沿用 `pointer-events-none` 或 `isGridReady` 判斷）。
- **驗收**：
  - [x] 動畫結束後立刻點中目標，記錄的反應時間 < 1 秒
  - [x] 動畫播放中點擊無效，不會記錄反應
  - [x] 分數公式本身不變

#### B03｜手機上大網格超出螢幕 ✅（`cfb8ebc`）
- **問題**：`getResponsiveSize()` 在手機版回傳固定 65 / 80 / 100px，沒有依螢幕寬度計算。375px 寬的手機，5 欄需要 389px、6 欄需要 470px，會溢出。
- **範圍**：`pages/task/game-grid.vue`
- **做法**：手機版也用 `(可用寬度 − (cols−1)×gap) / cols` 與高度上限取最小值，理想值仍用現有 65/80/100 當上限。必要時手機版縮小 `gridGap`（維持 8px 網格，例如 8px）。
- **驗收**：
  - [x] 375×667（iPhone SE）下 3×4、4×5、5×6、6×8 網格都完整顯示、不需水平捲動
  - [x] 桌機版尺寸行為不變
- **備註**：6×8 在 iPhone SE 上斑塊縮為 46px（原設計 65px），與 D03 校準議題相關。桌機 1280×800 的 6×8 仍會超出畫面高度（既有問題，未處理）。

#### B04｜斑塊在 Retina 螢幕上模糊 🔶（`5f29387`）
- **問題**：canvas 的像素尺寸 = CSS 尺寸，沒有乘 `devicePixelRatio`，在 iPhone（3x）上被放大而模糊，直接影響視覺刺激。
- **範圍**：`components/GaborCanvas.vue`
- **做法**：畫布像素寬高 = `size × dpr`，CSS `width/height` = `size`；繪製時所有長度參數（frequency、sigma、邊緣淡出）依 dpr 換算，讓斑塊在 CSS 尺寸上的外觀不變。dpr 上限可設 3。必須維持 `ImageData` 直接寫入、不 readback。
- **驗收**：
  - [ ] iPhone / Retina 螢幕上條紋邊緣清晰 — 已在 2x 螢幕確認畫布像素加倍，**待 iPhone 3x 實機確認**
  - [x] 斑塊的條紋數量與大小（以 CSS px 看）跟修改前一致
  - [ ] 6×8 網格產生新題目時沒有明顯卡頓 — Mac 2x 實測全部重繪約 40 ms，**待 iPhone 實機確認**

### 7.2 🟡 遊戲設計（需決策，先不要實作）

#### D01｜難度改成「依表現」自適應（需決策）
- **現況**：等級只由累積 XP 決定，答錯也會拿 XP → 玩越久越難，跟表現無關。粗估每局約 200 XP，到 5×6 網格要一百多局、6×8 要近千局。
- **提案**：保留現有等級曲線當「起點」，局內再加 staircase：連對 2 題 → 局內難度 +1；答錯 1 題 → −1。（或：XP 依正確率加權）
- **待 Way 決定**：採用哪個方案？網格門檻是否下修？

#### D02｜答錯的處理（需決策）
- **現況**：答錯可一直點到對，亂點也能過關，只影響正確率。
- **選項**：(a) 答錯直接換下一題並記為錯；(b) 答錯扣分；(c) 維持現狀。

#### D03｜螢幕校準（需決策）
- **現況**：`pxPerMm` 寫死 6.3，沒有校準 UI；每格頻率隨機 ×0.28–0.66，擾動幅度大於難度曲線本身的變化。
- **選項**：(a) 設定頁加「拿信用卡對尺寸」校準；(b) 依裝置型號預設；(c) 縮小頻率擾動範圍。

### 7.3 🟢 P1：資料同步

#### S01｜多裝置存檔互相覆蓋 🔶（`f1ebdc0`）
- **問題**：`saveStats()` 整列 upsert `game_stats`，兩台裝置輪流玩，後存者覆蓋先存者的 XP / 場次。
- **做法（建議）**：XP、場次、訓練時間改成在 Supabase 端累加（RPC，例如 `increment_stats(xp, minutes, sessions)`），或由 `game_sessions` 重新計算。需要新增 SQL migration，**Way 需在 Supabase 後台套用**。
- **驗收**：
  - [ ] A、B 兩裝置各玩一局後，雲端 XP = 兩局總和 — 用戶端邏輯已用模擬雲端驗證，**待登入後以兩台裝置實測**
  - [x] 未登入時行為不變
- **實作**：採 `increment_stats` RPC（`supabase/migrations/20261007000000_increment_stats.sql`，Way 已於 2026-10-07 在後台套用）。RPC 不存在時自動退回整列 upsert。最高分、最長連續取較大值；徽章合併。
- **已知限制**：RPC 成功但回應遺失時，下次存檔可能重複加一次；離線取得的最高分／徽章／連續天數在同步前重開 App 仍會被雲端舊值覆蓋。

#### S02｜上傳失敗的場次會遺失 🔶（`a839901`）
- **做法**：`recordSession` 失敗時放進 LocalStorage 待上傳佇列，下次 `loadStats` 或下一局結算時重送。
- **驗收**：
  - [ ] 斷網結算一局 → 恢復網路後再開 App，雲端出現該筆紀錄且不重複 — 佇列邏輯已用模擬網路驗證，**待登入後實測**

#### S03｜欄位語意不清 ✅（`4427b29`）
- `game_stats.consecutive_days` 實際存的是「最長連續天數」。已在 `database.types.ts` 與 `useGamePersistence.ts` 加註解；是否改欄位名稱另議（要動 DB）。

### 7.4 ⚪ P2：清理與一致性

| ID | 項目 | 檔案 | 狀態 |
| --- | --- | --- | --- |
| C01 | 時間讀不到時顯示假的「323 秒」，改成顯示 `--:--` | `pages/daily-goal.vue` | ✅ `4b995be` |
| C02 | `navigator.vibrate` 在 iOS 無效，改用 `@capacitor/haptics`（Web 時 fallback） | `pages/task/game-grid.vue` | 🔶 `f4c3c2c`，待 iOS 實機確認震動 |
| C03 | 移除未使用的設定：`brightnessLevel`、`gaborTheme`；GaborCanvas 的 `primaryColor` prop（`noiseVolume` 有被 `useAudio.ts` 使用，保留） | `useAppSettings.ts`、`GaborCanvas.vue`、呼叫端 | ✅ `79cd321` |
| C04 | 離開確認框、設定頁的 `rounded-lg` 改成符合規範；確認框標題改用 typography class | `game-grid.vue`、`settings.vue` | ✅ `000dd84`（依決定只改確認框兩顆按鈕；設定頁與標題不改） |
| C05 | `SelectButton` 寫死的 `#695D40`、NavigationRail 的 `text-white` 改用既有 token | `SelectButton.vue`、`NavigationRail.vue` | ✅ `8e103e5`（`SelectButton` 無任何頁面使用，已於 `3f769b8` 刪除） |
| C06 | 斑塊顏色 hex 重複寫在兩處，抽成共用（或讀 CSS 變數） | `game-grid.vue`、`TutorialCarousel.vue` | ✅ `f966927`（抽成 `useGaborAppearance`） |
| C07 | 網格格子改成 `<button>`，加 `aria-label`；桌機支援方向鍵＋Enter 選擇 | `game-grid.vue` | ✅ `8132894`（方向鍵＋Enter／空白鍵；標籤只描述位置；未以螢幕報讀器實測） |
| C08 | `params?: any` 補上型別 `GaborParams` | `GaborCanvas.vue`、`game-grid.vue` | ✅ `798c330`（未跑型別檢查，專案未安裝 `vue-tsc`） |
| C09 | `dist` symlink 指向別的專案（`gabor-app-wireframe-demo`），改指向本專案 `.output/public` 或刪除 | repo 根目錄（**請 Way 手動處理**） | ✅ 已由 Way 於 2026-10-08 刪除（不在版控內，無 commit） |
| C10 | `ios/` 被 `.gitignore` 排除，評估是否納入版控 | `.gitignore`（**需決策**） | ✅ `201da74`（納入 20 個原生專案檔；建置產物與 `cap sync` 產生的檔案仍排除；未從乾淨 clone 實際建置驗證） |
| C11 | 整併文件：README、PRD、DESIGN 保留；GEMINI.md、`.gabor_app_wireframe_...md` 過時內容移除或合併 | 根目錄文件 | ⏸ 待決策 |

---

## 8. 執行順序建議

1. ✅ **第一批（P0）**：B01 → B02 → B03 → B04（每項一個 commit）
2. ✅ **第二批（P2 快速清理）**：C01、C02、C03、C04、C05、C06、C08
3. ✅ **第三批**：S02 → S01（S01 需要 DB migration）、S03
4. ⏸ **決策後**：D01、D02、D03、C11（C07、C10 已完成）
5. **待實機／登入後驗證**：B04（iPhone 3x）、C02（iOS 震動）、S01（兩台裝置）、S02（斷網補傳）

## 9. 給 Claude Code 的執行規則

- 一次只做一個 ID，完成後說明改了哪些檔案、如何驗證，然後停下等確認。
- Commit 格式：`fix(B01): use local date for daily achievement keys`
- **不要執行** `npm install`、`npm run build`、`npm run test`、`git push`（見 CLAUDE.md）。
- 遵守第 5.5 節的技術限制；第 5 節的公式除非該 ID 明確要求，否則不改。
- 標示「需決策」或「請 Way 手動處理」的項目不要自行實作。
- UI 改動要檢查：手機 / 桌機、深色模式、導覽列。

## 10. 不在本階段範圍

- 新的訓練任務類型
- Apple 登入、Android 版
- 付費機制

## 11. 未來展望

- 局內自適應難度上線後，加入「能力曲線」分析（對比閾值、角度閾值隨時間變化）
- 更多徽章與里程碑
- E2E 測試：至少覆蓋「完成一局 → 結果頁 → 存檔」主流程
