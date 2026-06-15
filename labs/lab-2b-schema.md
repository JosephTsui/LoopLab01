# Lab 2-B：建立你的第一個 Schema

**完成時間：** 2026-06-15  
**產出檔案：** `experiments/schemas.js`

---

## 步驟 1 — CODE_ISSUE_SCHEMA 設計

```javascript
const CODE_ISSUE_SCHEMA = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          file:        { type: "string" },
          line:        { type: "number" },
          type:        { enum: ["bug", "performance", "security", "style"] },
          severity:    { enum: ["high", "medium", "low"] },
          description: { type: "string" },
          suggestion:  { type: "string" }
        },
        required: ["file", "line", "type", "severity", "description"]
      }
    },
    summary: {
      type: "object",
      properties: {
        total:  { type: "number" },
        byType: { type: "object" }
      }
    }
  },
  required: ["issues", "summary"]
}
```

**設計重點：**
- `enum` 限制 `type` 與 `severity` 的值域，防止模型自創分類
- `required` 確保每個 issue 都有定位資訊（file + line）
- `suggestion` 設為選填，允許模型在無把握時省略

---

## 步驟 2 — Schema 驗證測試

**測試任務：** 分析 `experiments/sample.js`，以 `CODE_ISSUE_SCHEMA` 強制結構化輸出

**子代理執行結果：**

| file | line | type | severity | description |
|------|------|------|---------|-------------|
| experiments/sample.js | 10 | bug | high | off-by-one：`i <= items.length` 讀到 `undefined`，產生 `NaN` |
| experiments/sample.js | 19 | bug | high | `safeGet()` 缺少 null 檢查，傳入 null 時拋 TypeError |
| experiments/sample.js | 24 | bug | high | `reduce()` 無初始值，空陣列時拋 TypeError |
| experiments/sample.js | 24 | bug | high | 因 L10 的 NaN，`total` 必為 NaN，`join()` 也會輸出 NaN |

summary: `{ total: 4, byType: { bug: 4 } }`

**Schema 符合性驗證：**

| 欄位 | 期望類型 | 實際值 | 符合？ |
|------|---------|--------|-------|
| issues | array | 4 個物件 | ✅ |
| issues[].file | string | "experiments/sample.js" | ✅ |
| issues[].line | number | 10, 19, 24, 24 | ✅ |
| issues[].type | enum | "bug" | ✅ |
| issues[].severity | enum | "high" | ✅ |
| summary.total | number | 4 | ✅ |
| summary.byType | object | `{"bug": 4}` | ✅ |

**觀察：** Schema 強制讓模型輸出可程式化處理的結構，不再是自由文字。

---

## 步驟 3 — 擴充練習：TASK_SCHEMA

```javascript
const TASK_SCHEMA = {
  type: "object",
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id:       { type: "string" },
          title:    { type: "string" },
          status:   { enum: ["todo", "in_progress", "done", "blocked"] },
          priority: { enum: ["high", "medium", "low"] },
          dueDate:  { type: "string" },
          assignee: { type: "string" }
        },
        required: ["id", "title", "status", "priority"]
      }
    }
  },
  required: ["tasks"]
}
```

**設計決策：**
- `dueDate` 與 `assignee` 設為選填（任務初建時可能未指定）
- `status` 用 enum 限制四種狀態，避免模型自由發揮（如 "in progress" vs "in_progress"）
- `id` 必填，確保每個任務可被唯一識別與追蹤

---

## 核心學習

**Schema 的三個作用：**

| 作用 | 說明 |
|------|------|
| **型別保證** | number/string/enum 確保下游程式碼不需防禦性型別轉換 |
| **強制重試** | 模型輸出不符 Schema 時，系統自動要求重新生成 |
| **降低幻覺** | enum 限制值域，防止模型捏造不存在的分類或狀態 |
