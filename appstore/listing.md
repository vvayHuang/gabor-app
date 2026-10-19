# App Store Connect 上架資料草稿

> 草稿（2026-10-19）。主要語言為繁體中文（台灣），另附英文版（對應 `en.lproj` 的 Wavelet）。
> 字數限制依 App Store Connect：名稱與副標題各 30 字元、宣傳文字 170、描述 4000、關鍵字 100。
> R04（Apple 登入）完成後，描述、隱私問卷與審核備註都要補上 Apple 登入。

---

## 1. 基本資料

| 欄位 | 內容 | 備註 |
| --- | --- | --- |
| 名稱 | 小波 | 2 字元。若「小波」已被別的 App 使用，可改「小波：視覺專注訓練」 |
| 副標題 | 每天幾分鐘的視覺專注練習 | 12 字元 |
| Bundle ID | `online.vvayhuang.wavelet` | 第一次上傳後不能改 |
| SKU | `wavelet-ios` | 只給自己看，可自訂 |
| 版本 | 1.0（build 1） | `MARKETING_VERSION`／`CURRENT_PROJECT_VERSION` |
| 主要類別 | 教育 | 次要類別建議「遊戲 > 益智」。不建議選「健康」或「醫療」，以免被要求提供醫療宣稱的依據 |
| 年齡分級 | 4+ | 問卷全部回答「無」 |
| 價格 | 免費 | 無內購 |
| 支援網址 | https://gabor-patch.vercel.app | R06 |
| 隱私權政策網址 | https://gabor-patch.vercel.app/privacy | R06 |
| 行銷網址 | （可留空） | |
| 版權 | © 2026 小波 | 可改成你的名字 |

## 2. 繁體中文（台灣）

### 宣傳文字（170 字元內，可隨時更新、不需送審）

每天幾分鐘，在一格格條紋中找出角度不同的那一個。難度會依你的表現自動調整，練習剛剛好的專注。

### 描述

小波是一款簡單、安靜的視覺練習。畫面上有一格一格的條紋圖案（Gabor 斑塊），其中只有一個的角度和其他不同，你要做的就是找到它。

【怎麼玩】
• 每題點選角度不一樣的那一格
• 答得又快又準，分數越高
• 一局分兩個階段，中間可以稍作休息
• 練習結束後，跟著浪聲閉眼放鬆一下

【難度會跟著你調整】
連續答對，條紋會變淡、角度差變小、格子變多；答錯時難度會往回降一點。每次都在「有點挑戰、又不會太難」的範圍裡練習。

【看得見的進步】
• 等級與經驗值：每次練習都會累積
• 連續天數與成就徽章：養成每天練習的習慣
• 紀錄頁：總練習次數、最高分、累計時間一目了然

【不登入也能玩】
選擇「先不登入」即可完整遊玩，紀錄只存在這台裝置。想在多台裝置同步進度時，再用 Google 帳號登入。

【安靜、不打擾】
• 沒有廣告，不追蹤，不使用第三方分析
• 支援深色模式
• 離線也能練習，恢復連線後自動同步

小波是練習用的小遊戲，不是醫療器材，不能用來診斷或治療任何視力問題。若對視力有疑慮，請諮詢專業醫師。

### 關鍵字（逗號分隔，不加空格，100 字元內）

視覺,專注,訓練,反應,大腦,注意力,觀察力,找不同,條紋,方向,對比,練習,每日,益智,Gabor

> 不必重複 App 名稱與類別名稱（App Store 已會比對）。避免「視力」「改善近視」等字眼，以免被視為醫療宣稱。

### 新功能（第一版可留空）

第一版上架。

## 3. English (U.S.)

| Field | Content |
| --- | --- |
| Name | Wavelet |
| Subtitle | A few minutes of visual focus |

### Promotional text

Spend a few minutes a day finding the one patch whose stripes are tilted differently. The difficulty adapts to how you play, so every session is just challenging enough.

### Description

Wavelet is a calm, simple visual exercise. You see a grid of striped patterns (Gabor patches), and exactly one of them is tilted at a different angle. Your job is to find it.

HOW TO PLAY
• Tap the patch whose angle is different
• Answer quickly and correctly for a higher score
• Each game has two stages with a short break in between
• After each session, close your eyes and rest to the sound of waves

DIFFICULTY THAT FOLLOWS YOU
Get a few right in a row and the stripes become fainter, the angle difference smaller, and the grid larger. Miss one and the difficulty eases back a little, so you always practice at the edge of what you can do.

SEE YOUR PROGRESS
• Levels and XP that grow with every session
• Daily streaks and achievement badges
• Records of total sessions, best score and practice time

PLAY WITHOUT AN ACCOUNT
Choose "Continue without signing in" to play everything, with records kept on this device. Sign in with Google later if you want your progress synced across devices.

QUIET BY DESIGN
• No ads, no tracking, no third-party analytics
• Dark mode
• Works offline and syncs when you reconnect

Wavelet is a practice game, not a medical device. It does not diagnose or treat any vision condition. If you have concerns about your eyesight, please see a professional.

### Keywords

vision,focus,attention,brain,reaction,training,spot the difference,stripes,orientation,contrast,daily

> 英文版的 App 內文字仍是中文；若英文版描述會讓人以為 App 是英文介面，可以先只上架繁中，或在描述註明介面為中文。

## 4. App 隱私（App Store Connect「App 隱私權」問卷）

依目前實作與 `ios/App/App/PrivacyInfo.xcprivacy`：

- **是否蒐集資料**：是（僅限登入的使用者；訪客資料只存在裝置上，不算蒐集）
- **是否用於追蹤**：否

| 資料類型 | 用途 | 與身分連結 | 用於追蹤 |
| --- | --- | --- | --- |
| 聯絡資訊 > 電子郵件地址 | App 功能 | 是 | 否 |
| 聯絡資訊 > 姓名 | App 功能 | 是 | 否 |
| 識別碼 > 使用者 ID | App 功能 | 是 | 否 |
| 使用者內容 > 遊戲內容 | App 功能 | 是 | 否 |

其他類別（位置、健康、財務、聯絡人、瀏覽紀錄、診斷、使用數據等）都選「未蒐集」。

> Google 大頭貼只是以網址顯示，App 不上傳也不儲存圖片，因此未列「照片或影片」。若想保守一點也可以加上。
> 沒有登入頭像時，個人頁會從 `api.dicebear.com` 載入一張固定的預設頭像（`profile.vue:21`），請求不含使用者資料，但隱私權政策寫「無第三方服務」，之後可考慮改成 App 內建圖片。

## 5. 審核資訊（App Review Information）

**登入資訊**：不需要示範帳號（取消勾選「需要登入」）。

**備註（Notes）**：

```
Wavelet is a visual attention exercise. Users find the one striped patch (Gabor patch) whose orientation differs from the others; difficulty adapts to their answers.

No account is required. On the sign-in screen, tap "先不登入，直接開始" (Continue without signing in) to use every feature. Data then stays on the device.

Signing in with Google is optional and only syncs progress across devices.
To delete an account: Settings (設定) > 刪除帳號 (Delete account). This permanently deletes the account and all its data on our server.

The app interface is in Traditional Chinese.
The app is not a medical device and makes no medical claims.
```

**聯絡資訊**：姓名、電話、email（你填寫，不會公開）。

## 6. 截圖

- 尺寸：6.9 吋 iPhone，直向 1320 × 2868（iPhone 17 Pro Max 模擬器）。App Store Connect 會用這組自動縮給較小的機型。
- 數量：最少 1 張、最多 10 張，建議 4–6 張。
- 檔案：`appstore/screenshots/`（2026-10-19 以訪客模式在模擬器實際玩一局後拍攝，JPEG、無透明通道；App Store Connect 不接受含透明通道的 PNG）

| 檔案 | 畫面 | 說明文字建議（若之後要加標題） |
| --- | --- | --- |
| `01-game-light.jpg` | 訓練中（3×4 網格） | 找出角度不同的那一個 |
| `02-results-light.jpg` | 本局結果 | 又快又準，分數越高 |
| `03-daily-goal-light.jpg` | 今日目標達成 | 每天幾分鐘就好 |
| `04-records-light.jpg` | 紀錄頁 | 看得見的進步 |
| `05-prepare-light.jpg` | 準備頁 | 準備好放鬆了嗎？ |
| `06-relax-light.jpg` | 練習後的放鬆（浪聲） | 練習完，閉眼休息一下 |
| `07-profile-light.jpg` | 個人頁（等級、成就） | 等級與成就，陪你養成習慣 |
| `08-game-dark.jpg` | 深色模式訓練中（4×5 網格） | 支援深色模式 |

注意：
- `02` 的平均反應 10.73 秒、訓練時間 2:20，是因為截圖時每題都要先截圖再判斷，比真人慢很多，看起來不太自然。建議你自己實際玩一局再重拍這張。
- `04` 只有一天、一次的紀錄，日曆比較空。若想要更好看，可在玩過幾天之後重拍。
- `07` 是訪客的預設頭像（從 `api.dicebear.com` 載入），名稱顯示「使用者」。
