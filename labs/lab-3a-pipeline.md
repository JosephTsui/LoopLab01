# Lab 3-A：Pipeline 實作練習

## 執行結果

| 文章 | 關鍵字 |
|------|--------|
| JavaScript Promises | Promise、非同步、執行器函式、串鏈、平行執行 |
| Docker vs VM | 容器、虛擬機器、Docker、微服務架構、虛擬化 |
| REST API Design | REST API、HTTP 方法、JSON、無狀態設計、版本控制 |
| Git Branching | 分支策略、GitFlow、主幹開發、GitHub Flow、發布頻率 |
| PostgreSQL Indexing | 索引類型、查詢效能、複合索引、部分索引、pg_stat_user_indexes |

## 執行統計

| 指標 | 數值 |
|------|------|
| Subagents 數量 | 15（5 篇 × 3 階段） |
| 耗時 | 約 28 秒 |
| Token 消耗 | 215,625 |

## 觀察心得

**Pipeline 特性**：
- 每篇文章獨立走完三個 Stage，不等其他文章
- Article A 在 Summarize 時，Article B 可能才剛開始 Translate
- Wall-clock time ≈ 最慢單篇的完整處理時間（不是所有文章加總）

**為何不用 Parallel？**
- 每個 Stage 只需要「自己的」上一 Stage 結果
- 沒有跨文章的依賴，不需要等所有文章同時完成再進下一步
- Pipeline 延遲更低，是正確選擇

## 腳本

`workflows/article-pipeline.js`

## 輸出

`reports/articles/` — 5 篇文章的關鍵字報告
