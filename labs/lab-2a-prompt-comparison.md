# Lab 2-A：提示工程對決實驗

**完成時間：** 2026-06-15  
**分析對象：** `experiments/sample.js`

---

## 提示 V1（模糊）

```
幫我看看這個檔案有什麼問題
```

### 回應結果

- processData() 第 10 行 off-by-one 錯誤
- safeGet() 沒有 null 檢查
- formatOutput() 的 reduce() 在空陣列會拋錯
- 整體缺少輸入驗證

**特徵：** 條列式，無位置資訊，無修復建議，無嚴重性分級，約 4 行

---

## 提示 V2（結構化）

```
分析 experiments/sample.js：
- 找出所有可能的 runtime error（null reference, type mismatch）
- 找出效能問題（不必要的迴圈、重複計算）
- 每個問題說明：檔案位置 + 問題描述 + 修復建議
- 只報告有把握的問題，不確定的跳過
- 輸出格式：markdown 表格
```

### 回應結果

| 位置 | 類型 | 問題描述 | 修復建議 |
|------|------|---------|---------|
| `processData()` L10 | Runtime Error | `i <= items.length` off-by-one，最後一次讀取 `items[items.length]` 即 `undefined`，`undefined * 2` 產生 `NaN` | 改為 `i < items.length` |
| `safeGet()` L19 | Runtime Error | `obj[key]` 未檢查 `obj` 是否為 null，傳入 null 時直接拋 `TypeError` | 加上 `if (!obj) return undefined` |
| `formatOutput()` L24 | Runtime Error | `reduce()` 在空陣列無初始值時拋 `TypeError` | 改為 `reduce((a, b) => a + b, 0)` |
| `processData()` 全域 | 缺少驗證 | 未驗證 `items` 是否為陣列 | 加上 `Array.isArray()` 檢查 |

**特徵：** 表格式，含行號、問題類型、具體描述、可直接執行的修復建議

---

## 品質差異比較

| 維度 | V1 模糊提示 | V2 結構化提示 |
|------|-----------|-------------|
| 輸出格式 | 條列（無結構） | Markdown 表格（可直接用） |
| 位置資訊 | 函式名稱 | 函式名稱 + 行號 |
| 問題描述深度 | 一句話現象 | 說明根因與影響（如 NaN 污染） |
| 修復建議 | 無 | 具體程式碼層級建議 |
| 問題分類 | 無 | Runtime Error / 缺少驗證 |
| 可操作性 | 低（需再追問） | 高（可直接對照修改） |

---

## 核心學習

**提示工程的 5 個結構化元素：**

| 元素 | V1 | V2 |
|------|----|----|
| **目標** | 模糊（「有什麼問題」） | 明確（runtime error + 效能問題） |
| **約束** | 無 | 「只報告有把握的」 |
| **工具提示** | 無 | 隱含（分析特定檔案） |
| **輸出格式** | 無指定 | markdown 表格 |
| **停止條件** | 無 | 不確定的跳過 |

**結論：** 相同的模型、相同的程式碼，提示品質決定輸出的可用程度。結構化提示讓 Agent Loop 的每次迭代產出更高密度的可用資訊，減少後續追問的往返次數。
