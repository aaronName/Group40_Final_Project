# Group40｜組員 A 交付

課程：軟體測試。組員 A：吳軒瑋／315554031。依 Group40 proposal 的「受測網站與缺陷設計」實作。

這份專案提供 React + TypeScript + Vite 的校園活動報名網站、修正版、18 個單一缺陷版本與 1 個整合缺陷版本，以及缺陷設計、重現步驟與交接文件。所有資料均為模擬，不連線至後端、不寄信、不寫入 localStorage。

## 第一次啟動

1. 安裝 Node.js 22.12 以上版本，建議固定使用 22 LTS。
2. 解壓縮後，使用 VS Code 開啟 `Group40_A` 資料夾，在該資料夾開終端機。
3. 執行：

```sh
npm ci
npm run dev -- --port 5173 --strictPort
```

4. 開啟 http://localhost:5173/ 。預設為修正版首頁。

要結束伺服器，在終端機按 Ctrl+C。第一次安裝套件需要網路，網站本身所有資產均由本機提供。

## 版本與四個狀態

| 參數 | 可用值 | 用途 |
| --- | --- | --- |
| `variant` | `fixed` | 無主動植入缺陷的對照版，不代表完整 WCAG 合規 |
| `variant` | `N01` 到 `S03`（詳私有清單） | 每次只啟用一個指定缺陷 |
| `variant` | `all` | 同時啟用 18 個缺陷；僅供整合流程觀察 |
| `state` | `list` | 活動列表載入 |
| `state` | `detail` | 活動詳細資料 |
| `state` | `form-errors` | 空白報名表單與錯誤摘要 |
| `state` | `dialog` | 預填測試姓名、信箱與同意，並開啟確認對話框 |

範例：

- 修正版活動頁：http://localhost:5173/?variant=fixed&state=detail
- 單一缺陷：http://localhost:5173/?variant=N01&state=form-errors
- 整合版：http://localhost:5173/?variant=all&state=list

每次變更 URL 都會重新載入並重設狀態。頁面上的導覽保留當前版本。頁面沒有研究控制面板，以避免干擾掃描與焦點順序。只有一個可報名的研究活動；第二張卡片是標示「即將開放」的靜態內容。

`state` 直達用於重現；正式測試建議使用 `scripts/navigation.ts` 的實際點擊流程進入狀態。`form-errors` 進入即呈現錯誤，是刻意固定的研究入口；不是一般產品初次進入的 UX 設計。

## 給 A 的展示順序

1. 打開修正版首頁，篩選活動並進入活動詳細資料。
2. 用 Tab 操作流程展開、場地導覽及報名連結。
3. 在表單填測試姓名與 `student@example.test`，勾選同意。
4. 開啟確認框，示範 Tab 循環、Escape 關閉與焦點返回；再次開啟並完成報名。
5. 換到 `variant=N01&state=form-errors`，解釋「看得到姓名，但輸入欄位沒有可存取名稱」。
6. 切回 `fixed`，比較修復後名稱關聯。是否被 axe 找出，須由 B 實際執行後再報告。

## 建置與驗收

```sh
npm run audit:fixture
npm run build
npx playwright install chromium
npm run qa
```

`npm run qa` 自動啟動測試用 Vite 伺服器（5173）。關閉其他非本專案的 5173 服務，避免測錯網站。若使用其他主機，以環境變數 `BASE_URL` 指定完整網站根網址，並自行啟動該網站。

Playwright 測試是 A 的受測網站驗收樣例，用來檢查修正版、版本入口與植入機制；不是 B 的正式 A/B 比較配置。正式鍵盤斷言必須由 B 在先導測試後、看到正式結果前另行凍結。不得直接拿這些驗收樣例計算研究偵測率。

實際完成的檢查與未完成事項見 `VERIFICATION.md`。本次沒有宣稱瀏覽器驗收或螢幕閱讀器測試已通過。

## 檔案索引

| 檔案／資料夾 | 用途 |
| --- | --- |
| `src/main.tsx` | 三個頁面、表單、對話框及 18 個缺陷分支 |
| `src/fixture.ts` | 版本開關、匿名案例代碼與狀態入口 |
| `src/styles.css` | 網站視覺與受控對比／焦點樣式 |
| `public/venue.svg` | 本機資訊圖，供替代文字語意對照 |
| `docs-private/DEFECTS.md` | 18 個缺陷的重現步驟、修正行為與裁決條件 |
| `docs-private/defects.json`、`defects.csv` | 可匯入的缺陷清單；CSV 為 UTF-8 BOM |
| `docs-private/adjudication.csv` | 每個候選的待裁決紀錄，不能預填真值 |
| `docs-private/CASE_MAP.md` | 匿名案例映射，僅執行者／裁決者保管 |
| `HANDOFF_B.md` | 狀態導覽、選擇器及結果對接說明 |
| `PARTICIPANT.md` | 中性的操作任務與紀錄格式，供 C/D 制定正式清單時參考 |
| `A_REPORT.md` | A 負責章節草稿與方法限制 |
| `qa/fixture.spec.ts` | A 的驗收測試樣例 |
| `package-lock.json` | 固定完整套件相依樹，組員使用 npm ci |
| `dist/` | 本次建置的靜態產物；請透過 HTTP 伺服器開啟 |

## 人工檢查前的資料保管

完整壓縮檔包含原始碼及植入清單，請只先交給 A/B。C、D 在正式獨立人工測試結束前不查看 `docs-private`、原始碼、驗收測試與 axe 結果。B 只提供匿名案例網址、固定環境與中性任務清單。匿名代碼是減少提示的措施，並不是安全隔離；查看原始碼仍可能揭露設計。

正式人工檢查結束後，B 按提案擔任分歧裁決者，A 提供重現與修正版對照，D 才整合參考真值及統計。這份交付不代替 B/C/D 的實測，也沒有填造 TP、FN、FP、操作時間或螢幕閱讀器結果。
