// Sample file for Lab exercises
// Used in Lab 2-A (prompt engineering) and Lab 2-D (error recovery)

const DATA = [1, 2, 3, 4, 5]

// TODO: Add input validation
function processData(items) {
  let result = []

  for (let i = 0; i <= items.length; i++) {  // FIXME: off-by-one error
    result.push(items[i] * 2)
  }

  return result
}

// HACK: Temporary workaround for null items
function safeGet(obj, key) {
  return obj[key]  // Missing null check
}

function formatOutput(data) {
  const processed = processData(data)
  const total = processed.reduce((a, b) => a + b)  // NOTE: Will throw if array is empty
  return `Total: ${total}, Items: ${processed.join(', ')}`
}

console.log(formatOutput(DATA))
