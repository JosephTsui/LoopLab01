// 程式碼問題 Schema
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

// 任務追蹤 Schema（Lab 2-B 步驟 3 擴充練習）
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

module.exports = { CODE_ISSUE_SCHEMA, TASK_SCHEMA }
