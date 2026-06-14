# LoopLab01 檔案摘要報告

**產生時間：** 2026-06-15  
**目錄：** `D:\LoopLab\LoopLab01\`

---

## 檔案清單

| 路徑 | 大小（Bytes） | 大小（KB） | 最後修改時間 | 描述 |
|------|------------:|----------:|------------|------|
| `CURRICULUM.md` | 27,783 | 27.13 | 2026-06-14 | Loop Engineer 完整學習計劃（課程主文件） |
| `README.md` | 28 | 0.03 | 2026-06-13 | 專案標題說明 |
| `experiments/sample.js` | 707 | 0.69 | 2026-06-14 | Lab 練習用範例 JavaScript 檔案 |

---

## 目錄結構

```
LoopLab01/
├── CURRICULUM.md          ← 課程主文件（最大，27 KB）
├── README.md              ← 專案說明（28 bytes）
├── experiments/
│   └── sample.js          ← Lab 2-A 與 Lab 2-D 練習素材
└── reports/               ← 本報告所在目錄（新建）
```

---

## 各檔案摘要

### `CURRICULUM.md`（27,783 bytes）
Loop Engineer 的完整 12 週學習課程，包含 5 個 Phase 與 16 個 Hands-On Labs：

| Phase | 主題 | Labs |
|-------|------|------|
| Phase 1（第 1–2 週） | 基礎概念：Agent Loop 本質 | 1-A, 1-B, 1-C |
| Phase 2（第 3–5 週） | 核心技能：提示工程、記憶、錯誤處理 | 2-A, 2-B, 2-C, 2-D |
| Phase 3（第 6–8 週） | 進階模式：Pipeline / 對抗性驗證 | 3-A, 3-B, 3-C, 3-D |
| Phase 4（第 9–10 週） | 系統整合：MCP、Notion、Playwright | 4-A, 4-B, 4-C, 4-D |
| Phase 5（第 11–12 週） | 生產實戰：Skill 封裝、效能優化 | 5-A, 5-B, 5-C |

目前所有 Phase 完成度均為 **0%**（學習剛開始）。

---

### `README.md`（28 bytes）
僅含專案標題 `# LoopLab01`，為 git 初始提交時建立的佔位檔案。

---

### `experiments/sample.js`（707 bytes）
Lab 練習用的 JavaScript 範例檔案，刻意內建以下問題供分析練習：

| 位置 | 問題類型 | 說明 |
|------|---------|------|
| `processData()`, 第 10 行 | **Bug（off-by-one）** | `i <= items.length` 應為 `i < items.length`，會讀取 `undefined` |
| `safeGet()`, 第 19 行 | **Bug（缺少 null 檢查）** | 未驗證 `obj` 是否為 null |
| `formatOutput()`, 第 24 行 | **潛在錯誤** | `.reduce()` 在空陣列上會拋出例外 |
| 全域 | **缺少輸入驗證** | `processData()` 未驗證傳入的 `items` 是否為陣列 |

此檔案用於 **Lab 2-A**（提示工程對決）與 **Lab 2-D**（錯誤恢復觀察）。

---

## 統計摘要

| 項目 | 數值 |
|------|------|
| 總檔案數（不含 `.git`） | 3 |
| 總大小 | 28,518 bytes（27.85 KB） |
| 最大檔案 | `CURRICULUM.md`（27,783 bytes，佔 97.4%） |
| 最小檔案 | `README.md`（28 bytes） |
| 已建立目錄 | `experiments/`、`reports/` |
| 尚未建立目錄 | `labs/`、`workflows/`、`mcp-servers/` |

---

## 備註

- `.git/` 目錄已排除於統計之外，含 2 次提交記錄（分支：`main`）。
- 課程預期的 `labs/`、`workflows/`、`mcp-servers/` 目錄尚未建立，將在後續 Lab 練習中陸續建立。
- 本報告為 **Lab 1-A** 的產出物，對應 CURRICULUM.md 第 52–74 行的實驗任務。
