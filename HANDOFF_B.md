# 交接給 B：固定入口與測試合約

## 環境

- Node >=22.12；使用 package-lock.json 與 npm ci。
- Chromium 採 @playwright/test 1.56.1 下載的版本；瀏覽器實際版本請以 browser.version() 另存，不以套件版號代替。
- 固定 viewport 1280×900、locale zh-TW、reducedMotion reduce、縮放 100%。測試資料與網站資產不依賴外部 API。
- React 19.2.0、ReactDOM 19.2.0、Vite 7.2.2、TypeScript 5.9.3、@axe-core/playwright 4.11.0；axe-core 的實際解析版本由 lockfile 固定。
- 記錄 OS、Node/npm、瀏覽器、axe、網站 commit 或 SOURCE_SHA256.txt，並固定同一套環境跑各版本。

## 進入狀態

使用 `scripts/navigation.ts` 的 enterState(page, variant, state)，以真實操作從列表到對話框，避免依賴內部狀態 API。選擇器固定使用 data-testid，確保名稱缺失的植入不會使導覽失敗。使用名稱／角色查找則留給要驗證該屬性的斷言。

| 狀態 | 到達條件 | 建議等待 |
| --- | --- | --- |
| list | 列表顯示 | event-link 可見 |
| detail | 點第一張可報名活動 | agenda-toggle 可見 |
| form-errors | 點 enroll，按 review 驗證空白資料 | error-summary 可見 |
| dialog | 填姓名、有效信箱、勾同意、按 review | confirm-dialog 可見 |

直達網址可作為 A 重現與偵錯工具；正式比較請先決定直達或完整導覽，所有版本使用相同方式並凍結。每個版本／配置使用新的 browser context，避免焦點、篩選與快取殘留。

## 常用選擇器

| test ID | 用途 |
| --- | --- |
| event-link / enroll | 列表到詳細頁、詳細頁到表單 |
| category-tech / save-event | 分類、收藏 |
| agenda-toggle / step-1 / step-2 / step-3 | 流程展開、三步確認 |
| open-guide / guide-region / close-guide | 場地導覽及退出 |
| name / email / consent / review | 表單欄位、送出確認 |
| confirm-dialog / dialog-cancel / dialog-confirm | 對話框與操作 |
| success | 對話框確認後的動態訊息 |

## 互動覆蓋的邊界

四個狀態並不自動包含所有後續操作。detail 的導覽開啟、步驟啟動、流程展開，以及確認框後的成功訊息，都需額外動作才會出現。正式配置 A 若只掃四個狀態，不應事後增加特殊操作來追求偵測；先記錄未覆蓋。配置 B 的鍵盤斷言應於先導階段事先定義並凍結。若要加掃描時點，需先更新一致的方案與分母記錄。

`qa/fixture.spec.ts` 是 A 知道植入設計後編寫的白箱驗收，不能直接當作研究 B 的偵測結果。

## 結果與真值

1. 保存每個 variant、state、run、工具版本、起迄時間、原始 axe JSON 與節點。
2. axe incomplete 單獨記錄，不能自動計 TP；axe 的多個 node/rule 不等於多個缺陷。
3. 保持「候選 ID＋位置＋狀態」映射；裁決後才填 defects.json 的 confirmed。
4. 不成立或無法重現的候選，填排除原因；額外真實問題另表，不能算 FP。
5. 五次重複用來報告耗時與穩定性，不能把 18 個缺陷當成 90 個獨立樣本。
6. C/D 結束獨立檢查後，B 再結合 A 的植入資料裁決；A 支援重現，D 整合統計。

## 正式測試前待 B 確認

- 執行 A 的驗收並記錄瀏覽器測試結果。
- 先導確認修正版的非預期問題，若發現問題先修正並重新凍結網站版本。
- 凍結 WCAG 規則 tags、四個狀態與後續互動範圍、鍵盤斷言、資料匯出格式。
- 自行建立提案要求的正式 axe／鍵盤流程及 GitHub Actions（屬 B 分工）。
- 為 C/D 提供匿名網址，打亂順序；本專案映射可於先導後更換，但正式開始前必須凍結並保存。
