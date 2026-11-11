# 匿名案例映射（A/B 限閱）

只向檢查者發放匿名網址，不提供本表。頁面導覽保留 case 參數；case 與 variant 不能同時指定。這是目前固定映射，正式先導後可重排，正式開始前需凍結。

| 匿名代碼 | 實驗版本 | 列表入口 |
| --- | --- | --- |
| q7m | fixed | http://localhost:5173/?case=q7m&state=list |
| r2p | N01 | http://localhost:5173/?case=r2p&state=list |
| h8v | N02 | http://localhost:5173/?case=h8v&state=list |
| c4n | N03 | http://localhost:5173/?case=c4n&state=list |
| t9b | V01 | http://localhost:5173/?case=t9b&state=list |
| a6k | V02 | http://localhost:5173/?case=a6k&state=list |
| w3d | V03 | http://localhost:5173/?case=w3d&state=list |
| e5x | O01 | http://localhost:5173/?case=e5x&state=list |
| u8f | O02 | http://localhost:5173/?case=u8f&state=list |
| j2s | O03 | http://localhost:5173/?case=j2s&state=list |
| p6r | K01 | http://localhost:5173/?case=p6r&state=list |
| b9h | K02 | http://localhost:5173/?case=b9h&state=list |
| n4a | K03 | http://localhost:5173/?case=n4a&state=list |
| x7c | F01 | http://localhost:5173/?case=x7c&state=list |
| d3w | F02 | http://localhost:5173/?case=d3w&state=list |
| s5j | F03 | http://localhost:5173/?case=s5j&state=list |
| m8e | S01 | http://localhost:5173/?case=m8e&state=list |
| k2u | S02 | http://localhost:5173/?case=k2u&state=list |
| v6t | S03 | http://localhost:5173/?case=v6t&state=list |
| f9q | all | http://localhost:5173/?case=f9q&state=list |

改變代碼映射時同步修改 src/fixture.ts 並重建。此表順序不是正式人工測試順序。正式分派需平衡或打亂，並記錄順序、時間上限及未完成項目。
