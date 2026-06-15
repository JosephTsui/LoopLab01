# Loop Engineer 完整學習計劃

> **Loop Engineer** 是能夠設計、建構並優化 AI 自主代理循環 (Agentic Loop) 的工程師。
> 核心能力：將複雜任務拆解為可重複執行的智能迴圈，讓 AI 自主完成多步驟工作流程。

---

## 課程架構總覽

```
Phase 1 → 基礎概念    (2 週)   ── 理解 Agent Loop 的本質
Phase 2 → 核心技能    (3 週)   ── 掌握工具調用與提示工程
Phase 3 → 進階模式    (3 週)   ── 多代理協作與流程設計
Phase 4 → 系統整合    (2 週)   ── 外部工具、API、MCP 整合
Phase 5 → 生產實戰    (2 週)   ── 監控、優化、部署上線
```

每個 Phase 包含：概念講解 + **Hands-On Lab（實驗室練習）** + 里程碑驗收

---

## Phase 1：基礎概念（第 1–2 週）

### 1.1 什麼是 Agent Loop？

**核心概念：**
- **傳統程式**：輸入 → 處理 → 輸出（一次性）
- **Agent Loop**：任務 → 思考 → 行動 → 觀察 → 再思考 → ... → 完成

```
┌─────────────────────────────────────────┐
│            Agent Loop 示意圖             │
│                                         │
│   任務 ──► 思考 ──► 工具調用             │
│              ▲         │                │
│              │         ▼                │
│           觀察結果 ◄── 執行結果          │
│              │                          │
│          [達成目標?]                     │
│           是 → 完成                     │
│           否 → 繼續迴圈                  │
└─────────────────────────────────────────┘
```

**學習目標：**
- [ ] 理解 ReAct 框架（Reasoning + Acting）
- [ ] 區分 One-shot、Few-shot、Agentic 三種模式
- [ ] 理解 Agent 的三大組成：模型 + 工具 + 記憶

---

### 🧪 Lab 1-A：觀察你的第一個 Agent Loop

**目標**：親眼看到 Claude Code 的思考 → 行動迴圈過程

**步驟：**
```bash
# 在 LoopLab01/ 目錄下，給 Claude Code 一個多步驟任務：
# 「幫我分析這個目錄下有哪些檔案、它們的大小，
#   並生成一份摘要報告存成 reports/file-summary.md」

# 觀察重點：
# 1. Claude 使用了幾次工具？
# 2. 每次 tool call 的結果如何影響下一步？
# 3. 它如何決定「任務完成」？
```

**記錄表（填寫後存入 labs/lab-1a-notes.md）：**
```
工具調用次數：___
遇到的問題：___
如何自我修正：___
終止條件是什麼：___
```

---

### 🧪 Lab 1-B：設定你的 Loop Engineer 工作環境

**目標**：配置最佳化的 Claude Code 工作環境

**步驟 1 — 建立 CLAUDE.md：**
```markdown
# LoopLab 專案規則

## 角色
這是一個 Loop Engineer 的練習環境。

## 工作原則
- 所有實驗結果存入 labs/ 目錄
- 每個 Lab 完成後更新 CURRICULUM.md 的進度表
- 使用繁體中文回應

## 工具偏好
- 檔案操作優先使用 Read/Write/Edit，不用 cat/echo
- 搜尋優先使用 Grep，不用 find
```

**步驟 2 — 配置 .claude/settings.json：**
```json
{
  "permissions": {
    "allow": [
      "Bash(ls:*)",
      "Bash(mkdir:*)",
      "Read(*)",
      "Write(labs/*)",
      "Write(reports/*)"
    ]
  }
}
```

**步驟 3 — 建立目錄結構：**
```
LoopLab01/
├── CLAUDE.md
├── CURRICULUM.md
├── labs/           ← 每個 Lab 的練習與筆記
├── experiments/    ← 自由實驗腳本
├── reports/        ← 生成的報告
└── workflows/      ← Workflow 腳本
```

**驗收**：執行 `ls -la` 確認結構正確，並讓 Claude Code 讀取 CLAUDE.md 驗證它認識你的規則。

---

### 1.2 Claude Code 架構深入

**核心元件：**

| 元件 | 說明 | 對應概念 |
|------|------|---------|
| Main Loop | 主對話循環 | 主控制器 |
| Tool System | 工具調用層 | 執行器 |
| Memory System | 檔案式記憶 | 長期記憶 |
| Subagents | 子代理 | 平行執行單元 |
| MCP Servers | 外部工具協議 | 能力擴充 |

---

### 🧪 Lab 1-C：工具分類實驗

**目標**：親自測試每類工具的行為差異

**實驗 A — 並行 vs 串行讀取：**
```
任務：同時讀取 5 個檔案
測試 1：一次一個 Read 呼叫
測試 2：五個 Read 同時呼叫
比較：哪個更快？Claude 如何決定用哪種？
```

**實驗 B — Agent 委派：**
```
任務：「派一個子代理去統計 labs/ 目錄下的單詞數量」
觀察：主代理如何把任務傳給子代理？
觀察：子代理的回傳結果如何被使用？
```

**記錄於 labs/lab-1c-tool-experiments.md**

---

## Phase 2：核心技能（第 3–5 週）

### 2.1 提示工程 for Loop Engineers

**關鍵原則：**

1. **任務分解原則**：大任務 → 原子操作的序列
2. **上下文傳遞**：每次迴圈需要攜帶的狀態是什麼？
3. **終止條件**：何時迴圈應該停止？
4. **錯誤恢復**：當工具失敗時，如何重試或繞道？

**提示模板結構：**
```
[目標]      清楚說明最終要達成什麼
[約束]      不能做什麼、範圍限制
[工具提示]  優先用哪些工具
[輸出格式]  結果應該長什麼樣
[停止條件]  何時算完成
```

---

### 🧪 Lab 2-A：提示工程對決實驗

**目標**：透過對比感受提示品質的影響

**任務**：讓 Claude 分析一個 JavaScript 檔案的潛在問題

**提示 V1（模糊）：**
```
幫我看看這個檔案有什麼問題
```

**提示 V2（結構化）：**
```
分析 experiments/sample.js：
- 找出所有可能的 runtime error（null reference, type mismatch）
- 找出效能問題（不必要的迴圈、重複計算）
- 每個問題說明：檔案位置 + 問題描述 + 修復建議
- 只報告有把握的問題，不確定的跳過
- 輸出格式：markdown 表格
```

**記錄**：兩版提示的結果質量差異，整理到 `labs/lab-2a-prompt-comparison.md`

---

### 🧪 Lab 2-B：建立你的第一個 Schema

**目標**：設計並驗證結構化輸出

**步驟 1 — 建立 experiments/schemas.js：**
```javascript
// 程式碼問題 Schema
const CODE_ISSUE_SCHEMA = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          file: { type: "string" },
          line: { type: "number" },
          type: { enum: ["bug", "performance", "security", "style"] },
          severity: { enum: ["high", "medium", "low"] },
          description: { type: "string" },
          suggestion: { type: "string" }
        },
        required: ["file", "line", "type", "severity", "description"]
      }
    },
    summary: {
      type: "object",
      properties: {
        total: { type: "number" },
        byType: { type: "object" }
      }
    }
  },
  required: ["issues", "summary"]
}

module.exports = { CODE_ISSUE_SCHEMA }
```

**步驟 2 — 測試 Schema 驗證：**
- 故意讓 Agent 回傳不符合 Schema 的結果
- 觀察系統如何自動重試

**步驟 3 — 擴充練習：**
設計一個「任務追蹤」Schema，包含：id、title、status、priority、dueDate、assignee

---

### 2.2 記憶系統設計

Loop Engineer 需要設計三層記憶：

```
┌─────────────────────────────────────────────┐
│              記憶層次架構                     │
├─────────────────────────────────────────────┤
│ 工作記憶（Context Window）                   │
│   └── 當前對話、工具結果、臨時狀態            │
├─────────────────────────────────────────────┤
│ 短期記憶（Session Files）                    │
│   └── Tasks、Plans、臨時計算結果              │
├─────────────────────────────────────────────┤
│ 長期記憶（Memory System / Notion / DB）      │
│   └── 使用者偏好、專案知識、歷史決策          │
└─────────────────────────────────────────────┘
```

---

### 🧪 Lab 2-C：記憶系統實作

**目標**：建立跨 Session 的狀態持久化

**步驟 1 — 設計記憶結構：**
```
labs/memory/
├── MEMORY.md           ← 記憶索引
├── user_preferences.md ← 使用者偏好
├── project_context.md  ← 專案背景知識
└── session_log.md      ← 重要決策記錄
```

**步驟 2 — 建立記憶寫入工作流：**
```
任務完成後 → Claude 自動判斷：
  有沒有新的使用者偏好？→ 寫入 user_preferences.md
  有沒有架構決策？→ 寫入 project_context.md
  有沒有要在下次 session 繼續的事？→ 寫入 session_log.md
```

**步驟 3 — 驗收測試：**
1. Session A：讓 Claude 學習「你喜歡用繁體中文、不喜歡過長的說明」
2. 關閉並重開新 Session
3. Session B：讓 Claude 讀取記憶，驗證它記住了你的偏好

---

### 2.3 錯誤處理與韌性設計

**Loop 的四大失敗模式：**

| 失敗類型 | 症狀 | 對策 |
|---------|------|------|
| 工具失敗 | tool call 返回錯誤 | 捕捉錯誤 + 替代路徑 |
| 無限迴圈 | 永不達到終止條件 | 設置最大迭代數 |
| 上下文溢出 | Context window 超限 | 壓縮 / 分段處理 |
| 幻覺結果 | Agent 報告完成但未完成 | 驗證步驟 |

---

### 🧪 Lab 2-D：故意製造錯誤並觀察恢復

**目標**：了解 Agent Loop 如何處理失敗

**實驗 A — 工具失敗：**
```
讓 Claude 嘗試讀取一個不存在的檔案
觀察：它如何報錯？有沒有嘗試替代方案？
```

**實驗 B — 矛盾指令：**
```
指令：「把所有 .js 檔案讀取後，存入一個不存在的目錄下的檔案中」
觀察：它如何處理目錄不存在的問題？
觀察：有沒有先建立目錄？
```

**實驗 C — 驗證機制：**
```
讓 Claude 生成一段程式碼，然後要求它「自我驗證這段程式碼能正確執行」
觀察：它如何驗證？有沒有實際執行？
```

**記錄於 labs/lab-2d-error-recovery.md**

---

## Phase 3：進階模式（第 6–8 週）

### 3.1 Pipeline vs. Parallel 決策框架

**Pipeline（流水線）**——預設選擇：
```
Item A → Stage1 → Stage2 → Stage3 → Done
Item B → Stage1 → Stage2 → Stage3 → Done
         ↑ Item A 在 Stage3 時，Item C 已在 Stage1
```

**決策規則：**
- 後一階段需要**所有**前階段結果 → Parallel
- 後一階段只需要**自己的**前階段結果 → Pipeline
- 不確定 → 選 Pipeline（延遲更低）

---

### 🧪 Lab 3-A：Pipeline 實作練習

**目標**：建立第一個多階段 Workflow

**任務**：處理 5 篇英文技術文章（自行建立測試資料）

```javascript
// 建立 workflows/article-pipeline.js
export const meta = {
  name: 'article-pipeline',
  description: '處理技術文章：翻譯 → 摘要 → 關鍵字提取',
  phases: [
    { title: 'Translate', detail: '英翻中' },
    { title: 'Summarize', detail: '生成摘要' },
    { title: 'Extract', detail: '提取關鍵字' },
  ]
}

const ARTICLES = [
  'Article 1 content...',
  'Article 2 content...',
  // ...
]

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    translation: { type: "string" },
    summary: { type: "string" },
    keywords: { type: "array", items: { type: "string" } }
  },
  required: ["translation", "summary", "keywords"]
}

// Phase: 三階段 pipeline，每篇文章獨立處理
const results = await pipeline(
  ARTICLES,
  (article) => agent(`Translate to Traditional Chinese: ${article}`, 
    { label: 'translate', phase: 'Translate', schema: { type: "object", properties: { translation: { type: "string" } }, required: ["translation"] } }),
  (prev, original, idx) => agent(`Summarize in 2 sentences: ${prev.translation}`,
    { label: `summarize-${idx}`, phase: 'Summarize', schema: { type: "object", properties: { summary: { type: "string" } }, required: ["summary"] } }),
  (prev, original, idx) => agent(`Extract 5 keywords: ${prev.summary}`,
    { label: `keywords-${idx}`, phase: 'Extract', schema: { type: "object", properties: { keywords: { type: "array", items: { type: "string" } } }, required: ["keywords"] } })
)

return results
```

**驗收**：5 篇文章都有翻譯 + 摘要 + 關鍵字，存入 `reports/articles/`

---

### 🧪 Lab 3-B：Loop-Until-Dry 實作

**目標**：建立一個持續蒐集直到「乾涸」的 Agent

**任務**：掃描 LoopLab01/ 的所有程式碼，找出所有 TODO 和 FIXME 注釋

```javascript
// 建立 workflows/find-todos.js
export const meta = {
  name: 'find-todos',
  description: '找出所有 TODO/FIXME，直到連續2輪無新發現',
  phases: [{ title: 'Find' }, { title: 'Verify' }]
}

const TODO_SCHEMA = {
  type: "object",
  properties: {
    todos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          file: { type: "string" },
          line: { type: "number" },
          type: { enum: ["TODO", "FIXME", "HACK", "NOTE"] },
          content: { type: "string" }
        },
        required: ["file", "line", "type", "content"]
      }
    }
  }
}

const seen = new Set()
const allTodos = []
let dryRounds = 0

while (dryRounds < 2) {
  const result = await agent(
    `Find TODO/FIXME/HACK comments in LoopLab01/ source files. 
     Already found: ${allTodos.map(t => t.file + ':' + t.line).join(', ')}
     Focus on files not yet checked.`,
    { schema: TODO_SCHEMA, phase: 'Find' }
  )
  
  const fresh = result.todos.filter(t => {
    const key = `${t.file}:${t.line}`
    return !seen.has(key)
  })
  
  if (fresh.length === 0) {
    dryRounds++
    log(`Dry round ${dryRounds}/2 — no new findings`)
  } else {
    dryRounds = 0
    fresh.forEach(t => seen.add(`${t.file}:${t.line}`))
    allTodos.push(...fresh)
    log(`Found ${fresh.length} new TODOs, total: ${allTodos.length}`)
  }
}

return { todos: allTodos, total: allTodos.length }
```

---

### 🧪 Lab 3-C：對抗性驗證實作

**目標**：建立不輕易相信自己的 Agent

**任務**：生成程式碼建議，用 3 個獨立驗證者審查

```javascript
// 建立 workflows/adversarial-review.js
export const meta = {
  name: 'adversarial-review',
  description: '對程式碼變更做對抗性多角度驗證',
  phases: [{ title: 'Propose' }, { title: 'Verify' }, { title: 'Decide' }]
}

const PROPOSAL_SCHEMA = {
  type: "object",
  properties: {
    suggestion: { type: "string" },
    reasoning: { type: "string" },
    riskLevel: { enum: ["high", "medium", "low"] }
  },
  required: ["suggestion", "reasoning", "riskLevel"]
}

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    lens: { type: "string" },
    approved: { type: "boolean" },
    concerns: { type: "array", items: { type: "string" } },
    confidence: { type: "number" }
  },
  required: ["lens", "approved", "concerns", "confidence"]
}

// Step 1: 生成建議
phase('Propose')
const proposal = await agent(
  "Propose a refactoring for the main loop in experiments/sample.js",
  { schema: PROPOSAL_SCHEMA }
)
log(`Proposal: ${proposal.suggestion}`)

// Step 2: 三個不同視角的驗證者
phase('Verify')
const lenses = ['correctness', 'security', 'performance']
const verdicts = await parallel(
  lenses.map(lens => () =>
    agent(
      `You are a ${lens} expert. CRITICALLY evaluate this proposal:
       "${proposal.suggestion}"
       
       Try to find reasons why this is WRONG or RISKY.
       Default to approved=false if uncertain.`,
      { label: `verify:${lens}`, schema: VERDICT_SCHEMA }
    )
  )
)

// Step 3: 多數決
phase('Decide')
const approved = verdicts.filter(Boolean).filter(v => v.approved).length >= 2
log(`Decision: ${approved ? 'APPROVED' : 'REJECTED'}`)
log(`Votes: ${verdicts.map(v => `${v.lens}=${v.approved}`).join(', ')}`)

return { proposal, verdicts, approved }
```

---

### 3.2 預算感知與完整性批判者

---

### 🧪 Lab 3-D：完整性審計 Workflow

**目標**：建立「我遺漏了什麼？」的自我審查機制

**任務**：對 LoopLab01/ 做完整的程式碼品質審計

```javascript
// 建立 workflows/completeness-audit.js
export const meta = {
  name: 'completeness-audit',
  description: '完整性程式碼審計，包含遺漏補充',
  phases: [
    { title: 'Initial Scan' },
    { title: 'Critique' },
    { title: 'Supplement' }
  ]
}

// 初步掃描
phase('Initial Scan')
const initialFindings = await parallel([
  () => agent("Find all syntax errors", { label: 'syntax', phase: 'Initial Scan' }),
  () => agent("Find all unused variables", { label: 'unused-vars', phase: 'Initial Scan' }),
  () => agent("Find all missing error handling", { label: 'error-handling', phase: 'Initial Scan' }),
])

const allFindings = initialFindings.filter(Boolean).flat()
log(`Initial scan: ${allFindings.length} findings`)

// 完整性批判者
phase('Critique')
const critique = await agent(
  `Review this audit of LoopLab01/:
   Findings so far: ${JSON.stringify(allFindings)}
   
   What CRITICAL areas were NOT checked?
   - Which files were skipped?
   - Which error categories were missed?
   - Any security concerns not addressed?
   
   List gaps ONLY, not summaries of what was found.`,
  {
    schema: {
      type: "object",
      properties: {
        gaps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              area: { type: "string" },
              reason: { type: "string" },
              searchQuery: { type: "string" }
            }
          }
        }
      }
    }
  }
)

log(`Critique found ${critique.gaps.length} gaps`)

// 補充掃描
phase('Supplement')
if (critique.gaps.length > 0) {
  const supplemental = await pipeline(
    critique.gaps,
    gap => agent(
      `Check for issues in area: ${gap.area}\nSearch: ${gap.searchQuery}`,
      { label: `supplement:${gap.area}`, phase: 'Supplement' }
    )
  )
  allFindings.push(...supplemental.filter(Boolean).flat())
}

return {
  totalFindings: allFindings.length,
  findings: allFindings,
  gapsFound: critique.gaps.length
}
```

---

## Phase 4：系統整合（第 9–10 週）

### 4.1 MCP Server 建構

MCP（Model Context Protocol）讓 AI 可以調用任何外部服務。

---

### 🧪 Lab 4-A：第一個 MCP Server

**目標**：建立一個連接本地資料的 MCP Server

**步驟 1 — 建立 mcp-servers/local-data-server.js：**
```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const server = new Server(
  { name: "local-data", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

// 定義工具
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_lab_status",
      description: "取得 LoopLab 各 Phase 完成狀態",
      inputSchema: {
        type: "object",
        properties: {
          phase: { type: "number", description: "Phase 編號 1-5，0 代表全部" }
        }
      }
    }
  ]
}))

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_lab_status") {
    // 讀取 CURRICULUM.md 並解析完成狀態
    return {
      content: [{ type: "text", text: "Lab status: Phase 1 - 2/3 complete" }]
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

**步驟 2 — 配置 settings.json：**
```json
{
  "mcpServers": {
    "local-data": {
      "command": "node",
      "args": ["mcp-servers/local-data-server.js"]
    }
  }
}
```

**步驟 3 — 驗收：**
在 Claude Code 中問「我的 Lab 完成狀態如何？」，驗證 MCP 正確回應。

---

### 🧪 Lab 4-B：Notion 整合工作流

**目標**：自動將 Lab 完成狀態同步到 Notion

**任務**：建立一個 Workflow 讀取 CURRICULUM.md 的進度，自動在 Notion 建立或更新追蹤頁面

```javascript
// workflows/sync-to-notion.js
export const meta = {
  name: 'sync-to-notion',
  description: '將 LoopLab 進度同步到 Notion',
  phases: [{ title: 'Read Progress' }, { title: 'Sync Notion' }]
}

// Step 1: 讀取本地進度
phase('Read Progress')
const progress = await agent(
  "Read CURRICULUM.md and extract the completion status of each Phase and Lab. Return structured data.",
  {
    schema: {
      type: "object",
      properties: {
        phases: {
          type: "array",
          items: {
            type: "object",
            properties: {
              phase: { type: "number" },
              title: { type: "string" },
              labs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    completed: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
)

// Step 2: 同步到 Notion（使用 Notion MCP）
phase('Sync Notion')
for (const phase of progress.phases) {
  await agent(
    `Create or update a Notion page titled "LoopLab Phase ${phase.phase}: ${phase.title}" 
     with the following lab completion data: ${JSON.stringify(phase.labs)}`,
    { label: `notion:phase-${phase.phase}`, phase: 'Sync Notion' }
  )
}

return { synced: progress.phases.length }
```

---

### 🧪 Lab 4-C：Playwright 網頁自動化

**目標**：建立一個讓 Agent 自主操作瀏覽器的 Loop

**任務**：自動抓取指定網站的最新技術文章標題

```javascript
// 這個 Lab 在對話中執行（不是 Workflow）
// 讓 Claude 使用 Playwright MCP 工具：

/*
指令給 Claude：
「使用 browser_navigate 前往 https://dev.to/，
 然後找出首頁上的文章標題，
 把前 10 篇文章的標題和連結整理成 markdown 表格，
 存入 reports/dev-to-articles.md」

觀察 Claude 如何：
1. 導航到頁面
2. 使用 browser_snapshot 觀察頁面結構
3. 提取需要的資訊
4. 如果第一次沒找到，如何重試
*/
```

---

### 🧪 Lab 4-D：排程自動化

**目標**：建立每日自動執行的 Agent 任務

**任務**：設置一個每天早上執行的「學習進度報告」

```
使用 /schedule skill：

「每天早上 9 點，掃描 LoopLab01/ 的 labs/ 目錄，
  統計昨天新增了哪些 lab 筆記，
  生成一份 reports/daily-progress-YYYY-MM-DD.md 報告」
```

---

## Phase 5：生產實戰（第 11–12 週）

### 5.1 Skill 設計與封裝

---

### 🧪 Lab 5-A：設計並發布你的第一個 Skill

**目標**：將一個常用工作流打包成可重用的 Skill

**任務**：設計「looplab-progress」Skill

```markdown
# .claude/skills/looplab-progress.md

---
name: looplab-progress
description: |
  顯示 LoopLab 學習進度摘要。
  觸發時機：用戶詢問「我學到哪了？」「LoopLab 進度」「幫我看學習狀態」
---

# LoopLab 進度查詢

## 步驟
1. 讀取 CURRICULUM.md 中的進度表格
2. 掃描 labs/ 目錄，統計已建立的 lab 筆記數量
3. 計算每個 Phase 的完成百分比
4. 輸出簡潔的進度摘要

## 輸出格式
Phase 1: ██████░░░░ 60% (3/5 Labs)
Phase 2: ████░░░░░░ 40% (2/5 Labs)
...

下一步建議：繼續 Lab X-X「...」
```

---

### 🧪 Lab 5-B：效能剖析與優化

**目標**：測量並優化一個 Workflow 的執行成本

**步驟 1 — 建立基準測試：**
```javascript
// workflows/benchmark.js
// 執行同一任務的三種版本，比較 token 消耗

// 版本 A: 全部串行
// 版本 B: 全部並行
// 版本 C: 智能 pipeline（推薦）

// 記錄每個版本：執行時間 + token 消耗
```

**步驟 2 — Token 優化清單：**
- [ ] 靜態提示是否使用 Prompt Cache？
- [ ] 子代理是否用了比需要更大的模型？
- [ ] 有沒有重複讀取同一個檔案？
- [ ] 錯誤路徑是否造成不必要的重試？

**步驟 3 — 優化並重測：**
目標：在相同品質下，將 token 成本降低 20%+

---

### 🧪 Lab 5-C：最終整合專案（三選一）

#### 選項 A：智能程式碼審查系統

```
完整流程：
PR Diff 輸入
    │
    ▼
多維度並行審查（bugs / security / perf / style）
    │
    ▼
對抗性驗證高嚴重性問題
    │
    ▼
Loop-Until-Dry 確保完整性
    │
    ▼
生成結構化報告 → 存入 reports/
    │
    ▼
（選配）透過 Notion MCP 建立追蹤任務
```

#### 選項 B：自動知識庫維護

```
完整流程：
掃描 git log 最新 commits
    │
    ▼
提取架構決策 + 重要變更
    │
    ▼
對比現有知識庫（Notion）
    │
    ▼
更新過時條目 + 新增新條目
    │
    ▼
Cron 每日自動執行
```

#### 選項 C：智能信件處理流水線

```
完整流程：
掃描 M365 信箱
    │
    ▼
分類：需決策 / 資訊性 / 垃圾
    │
    ▼
提取截止日期 + 行動項目
    │
    ▼
建立 Notion 任務卡片
    │
    ▼
Cron 每日自動執行
```

---

## 學習資源地圖

### 核心文件
- Claude Code 官方文件：`/claude-api` skill 可快速查詢 API 規格
- MCP 協議：`/claude-api:mcp-builder` skill
- Workflow Script API：Claude Code Workflow 工具說明

### 練習環境目錄結構
```
LoopLab01/
├── CLAUDE.md           ← 專案規則（Lab 1-B 建立）
├── CURRICULUM.md       ← 本課程文件
├── labs/               ← 所有 Lab 筆記
│   ├── lab-1a-notes.md
│   ├── lab-1b-env.md
│   ├── lab-1c-tool-experiments.md
│   └── ...
├── experiments/        ← 自由實驗腳本
│   ├── schemas.js
│   └── sample.js
├── workflows/          ← Workflow 腳本
│   ├── article-pipeline.js
│   ├── find-todos.js
│   ├── adversarial-review.js
│   └── completeness-audit.js
├── mcp-servers/        ← 自定義 MCP Server
│   └── local-data-server.js
└── reports/            ← 生成的報告
    ├── articles/
    └── daily-progress-*.md
```

---

## 里程碑自我評估與進度追蹤

| Phase | 主題 | Labs | 完成度 |
|-------|------|------|--------|
| 1 | 基礎概念 | 1-A, 1-B, 1-C | ✅ 100% |
| 2 | 核心技能 | 2-A, 2-B, 2-C, 2-D | ⬜ 0% |
| 3 | 進階模式 | 3-A, 3-B, 3-C, 3-D | ⬜ 0% |
| 4 | 系統整合 | 4-A, 4-B, 4-C, 4-D | ⬜ 0% |
| 5 | 生產實戰 | 5-A, 5-B, 5-C | ⬜ 0% |

**更新進度方式**：完成 Lab 後，將 `⬜` 改為 `✅`，並在 labs/ 目錄新增對應筆記。

---

## 通關條件

| Phase | 通過條件 |
|-------|---------|
| Phase 1 | 能解釋 Observe-Think-Act 循環；CLAUDE.md + settings.json 配置完成 |
| Phase 2 | 能設計有明確終止條件的提示；Schema 能成功強制模型重試 |
| Phase 3 | 能正確選擇 pipeline vs parallel；loop-until-dry + 對抗性驗證各完成一個 |
| Phase 4 | 建立並整合 MCP Server；Notion 或 Playwright 整合至少一個 |
| Phase 5 | 三選二完成最終整合專案；能分析並降低 workflow 的 token 成本 |

---

*最後更新：2026-06-14 | LoopLab01 課程 v1.1（含 Hands-On Labs）*
