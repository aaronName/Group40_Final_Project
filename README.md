# Group40｜校園活動報名網站與測試交接

這是「軟體測試」課程 Group40 的受測網站，由組員 A（吳軒瑋／315554031）負責實作，供全組進行無障礙自動化測試、鍵盤操作與人工檢查。

網站包含活動列表、活動詳細資料、報名表單及確認對話框，使用 React、TypeScript 與 Vite。所有資料皆為模擬；送出報名不會寄信或傳到後端，也不會保存在 localStorage。

## 各組員從哪裡開始？

| 工作 | 先閱讀 | 接下來要做的事 |
| --- | --- | --- |
| A：網站實作 | 本頁啟動步驟、[驗證紀錄](./VERIFICATION.md) | 確認網站運作，支援重現與修正；報告草稿見 [A_REPORT.md](./A_REPORT.md) |
| B：自動化測試 | [B 的交接說明](./HANDOFF_B.md) | 驗收網站、建立正式測試流程，提供 C／D 匿名案例網址與固定環境 |
| C／D：獨立人工檢查 | [操作任務草稿](./PARTICIPANT.md) | 依 B 提供的匿名網址與正式清單操作，分別記錄發現與耗時 |
| D：結果整合 | 獨立檢查完成後取得的裁決資料 | 整合參考真值與統計，保留原始獨立紀錄 |

**C／D 在正式獨立檢查結束前，請先只閱讀本頁前半部與操作任務草稿。** 完整專案含有缺陷設計，先由 A／B 保管；原始碼、私有文件、驗收測試與自動化結果，等獨立檢查完成後再查看，避免影響判斷。正式測試請使用 B 指派的匿名網址，不自行切換版本。

## 第一次在本機啟動（A／B）

### 1. 準備環境

安裝 **Node.js 22.12 以上**，建議全組統一使用 22 LTS。解壓縮後，以 VS Code 開啟本專案資料夾，選擇「終端機 → 新增終端機」。確認目前位置能看到 [package.json](./package.json)。

可先確認版本：

```sh
node --version
npm --version
```

### 2. 安裝套件並啟動

第一次使用，或取得新版相依套件設定後，執行：

```sh
npm ci
```

接著啟動網站：

```sh
npm run dev -- --port 5173 --strictPort
```

保留終端機開啟，在瀏覽器前往 **http://localhost:5173/**，應看到活動列表，預設為修正版。

之後再次開啟專案，只需執行啟動指令。要停止網站，在終端機按 `Ctrl+C`。安裝套件需要網路，網站本身的資料與資產由本機提供。

### 3. 熟悉基本操作

進入可報名活動的詳細頁 → 前往報名 → 填入測試姓名與 `student@example.test` → 勾選同意 → 開啟確認框 → 確認報名。

列表只有一個可報名的研究活動；另一張「即將開放」卡片是靜態內容。正式人工檢查仍以 B 提供的任務為準。

### 常見啟動問題

| 狀況 | 處理方式 |
| --- | --- |
| 找不到 `node` 或 `npm` | 安裝 Node.js 後，重新開啟 VS Code，再確認版本 |
| PowerShell 提示無法載入 `npm.ps1` | 將指令中的 `npm` 改為 `npm.cmd`，或改用 Command Prompt 終端機 |
| 找不到套件設定檔 | 確認終端機位於專案資料夾，而不是解壓縮後的外層資料夾 |
| 顯示 5173 已被使用 | 先確認該服務是否就是本專案；若需重啟，回到原本的終端機按 `Ctrl+C` 後再啟動 |
| 瀏覽器無法連線 | 確認啟動指令仍在執行，且網址是 `http://localhost:5173/` |

`localhost` 指的是目前這台電腦。C／D 若在其他電腦測試，請使用 B 另行提供的可連線網址。

## 目前進度與待完成事項

網站、版本切換與交接文件已提供，但正式實驗尚未完成。既有紀錄列出建置與資料檢查通過；瀏覽器驗收、螢幕閱讀器測試與正式人工實驗仍待執行。

1. A／B 在固定環境驗收網站，處理非預期問題。
2. B 完成先導測試，凍結正式流程、工具版本、案例順序與任務範圍。
3. C／D 依凍結後的安排獨立檢查並留下紀錄。
4. 獨立檢查完成後，由 B 裁決分歧、A 支援重現、D 整合真值與統計。

---

## A／B 技術說明：版本與狀態

**以下供 A／B 使用，C／D 請在獨立檢查完成後再閱讀。**

專案提供一個修正版、18 個單一缺陷版本與一個整合缺陷版本，以網址參數切換：

| 參數 | 值 | 用途 |
| --- | --- | --- |
| `variant` | `fixed` | 未主動植入缺陷的對照版，不代表完整 WCAG 合規 |
| `variant` | 指定缺陷 ID | 每次啟用一個缺陷，詳見 [私有缺陷清單](./docs-private/DEFECTS.md) |
| `variant` | `all` | 同時啟用 18 個缺陷，供整合流程觀察 |
| `state` | `list` | 活動列表 |
| `state` | `detail` | 活動詳細資料 |
| `state` | `form-errors` | 空白報名表單與錯誤摘要 |
| `state` | `dialog` | 預填測試資料並開啟確認對話框 |

範例：[修正版活動頁](http://localhost:5173/?variant=fixed&state=detail)、[修正版表單錯誤狀態](http://localhost:5173/?variant=fixed&state=form-errors)。

開啟新的參數網址會重新載入並重設狀態；頁面內導覽保留目前版本。`form-errors` 一進入就顯示錯誤，是為了固定重現條件。

直達網址用於重現與偵錯。正式比較的進入方式應事先統一並凍結；實際點擊流程可參考 [navigation.ts](./scripts/navigation.ts)。匿名案例管理見 [案例映射](./docs-private/CASE_MAP.md)，不要向受測組員提供映射表。匿名代碼只能減少提示，無法阻止從原始碼得知版本。

## A／B 技術說明：執行驗收

完成套件安裝後，依序執行：

```sh
npm run audit:fixture
npm run build
npx playwright install chromium
npm run qa
```

| 指令 | 用途 |
| --- | --- |
| `npm run audit:fixture` | 檢查缺陷資料、數量與實作開關是否一致 |
| `npm run build` | TypeScript 檢查與正式建置 |
| `npx playwright install chromium` | 安裝驗收需要的 Chromium，首次執行需要下載 |
| `npm run qa` | 執行 Playwright 網站驗收樣例 |

驗收預設使用 5173 埠，會啟動 Vite；在非 CI 環境也可能沿用已啟動的服務，因此請先確認該埠上的網站是本專案。若測試其他網址，設定 `BASE_URL` 並自行啟動目標網站，詳見 [測試設定](./playwright.config.ts)。

這些樣例是 A 用來檢查網站與缺陷植入機制的驗收，**不能直接作為 B 的正式比較結果或計算研究偵測率**。正式 axe 與鍵盤測試流程由 B 在先導階段建立並凍結，細節見 [B 的交接說明](./HANDOFF_B.md)。實際檢查結果與限制見 [VERIFICATION.md](./VERIFICATION.md)。

## A／B 技術說明：檔案導覽

| 檔案／資料夾 | 需要做什麼時查看 |
| --- | --- |
| [src/main.tsx](./src/main.tsx) | 修改頁面、表單、對話框與缺陷實作 |
| [src/fixture.ts](./src/fixture.ts) | 查看版本開關、匿名案例與狀態入口 |
| [src/styles.css](./src/styles.css) | 調整視覺、對比與焦點樣式 |
| [public/venue.svg](./public/venue.svg) | 查看場地資訊圖 |
| [docs-private/DEFECTS.md](./docs-private/DEFECTS.md) | 重現缺陷、比較修正行為與裁決條件 |
| [defects.json](./docs-private/defects.json)／[defects.csv](./docs-private/defects.csv) | 匯入缺陷候選資料；CSV 使用 UTF-8 BOM |
| [adjudication.csv](./docs-private/adjudication.csv) | 正式檢查後記錄裁決，不預填真值 |
| [qa/fixture.spec.ts](./qa/fixture.spec.ts) | 查看網站驗收樣例 |
| [package-lock.json](./package-lock.json) | 固定套件版本，全組使用 `npm ci` 安裝 |
| [SOURCE_SHA256.txt](./SOURCE_SHA256.txt) | 核對交付檔案雜湊 |
| [dist/](./dist/) | 取得建置產物；需透過 HTTP 服務開啟，不能直接雙擊 HTML |
