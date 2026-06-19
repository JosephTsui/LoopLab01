# Lab 3-B：Loop-Until-Dry 實作

## 執行結果
- 找到 4 筆 TODO/FIXME（全部在 experiments/sample.js）
- Agent 數：3
- Token 消耗：51,108
- 執行時間：72.6 秒

| 檔案 | 行號 | 類型 | 內容 |
|------|------|------|------|
| experiments/sample.js | 6 | TODO | Add input validation |
| experiments/sample.js | 10 | FIXME | off-by-one error |
| experiments/sample.js | 17 | HACK | Temporary workaround for null items |
| experiments/sample.js | 24 | NOTE | Will throw if array is empty |

## Loop-Until-Dry 機制觀察
- `dryRounds < 2` 作為停止條件
- 每輪把已找到的位置傳給下一輪，避免重複
- 連續 2 輪無新發現才停止，確保完整性

## 關鍵學習
- `seen` Set 用 `file:line` 作為去重 key
- `log()` 讓每輪結果即時可見
- 與 pipeline 不同：loop 的迭代次數事先未知，適合「不知道有多少」的蒐集任務
