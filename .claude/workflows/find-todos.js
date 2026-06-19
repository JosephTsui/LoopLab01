  export const meta = {
    name: 'find-todos',
    description: '找出所有TODO/FIXME，直到連續2輪無新發現',
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
            type: { enum: ["TODO", "FIXME", "HACK",
  "NOTE"] },
            content: { type: "string" }
          },
          required: ["file", "line", "type",
  "content"]
        }
      }
    }
  }

  const seen = new Set()
  const allTodos = []
  let dryRounds = 0

  while (dryRounds < 2) {
    const result = await agent(
      `Find TODO/FIXME/HACK comments in LoopLab01/
  source files.
       Already found: ${allTodos.map(t => t.file +
  ':' + t.line).join(', ')}
       Focus on files not yet checked.`,
      { schema: TODO_SCHEMA, phase: 'Find' }
    )

    const fresh = result.todos.filter(t => {
      const key = `${t.file}:${t.line}`
      return !seen.has(key)
    })

    if (fresh.length === 0) {
      dryRounds++
      log(`Dry round ${dryRounds}/2 — no new
  findings`)
    } else {
      dryRounds = 0
      fresh.forEach(t =>
  seen.add(`${t.file}:${t.line}`))
      allTodos.push(...fresh)
      log(`Found ${fresh.length} new TODOs, total:
  ${allTodos.length}`)
    }
  }

  return { todos: allTodos, total: allTodos.length }