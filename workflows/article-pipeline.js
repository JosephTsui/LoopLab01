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
  {
    id: 'article-1',
    title: 'Understanding Promises in JavaScript',
    content: `Promises are objects representing the eventual completion or failure of an asynchronous operation. A Promise is in one of these states: pending, fulfilled, or rejected. The Promise constructor takes a function called the executor, which receives resolve and reject functions. Using .then() chains, you can handle fulfilled values, while .catch() handles rejections. Promise.all() runs multiple promises in parallel and resolves when all complete.`
  },
  {
    id: 'article-2',
    title: 'Docker Containers vs Virtual Machines',
    content: `Containers and virtual machines are both virtualization technologies, but they differ fundamentally. VMs include a full operating system, making them heavy but highly isolated. Containers share the host OS kernel, making them lightweight and fast to start. Docker popularized containers by providing a standard format. Containers are ideal for microservices architectures where many small services run simultaneously on the same host.`
  },
  {
    id: 'article-3',
    title: 'Introduction to REST API Design',
    content: `REST (Representational State Transfer) is an architectural style for distributed systems. RESTful APIs use HTTP methods: GET retrieves resources, POST creates them, PUT updates them, and DELETE removes them. Resources are identified by URLs, and responses typically use JSON format. Good REST APIs are stateless, meaning each request contains all information needed. Versioning (e.g., /api/v1/) helps maintain backward compatibility.`
  },
  {
    id: 'article-4',
    title: 'Git Branching Strategies for Teams',
    content: `Effective branching strategies help teams collaborate without conflicts. GitFlow uses dedicated branches for features, releases, and hotfixes. Trunk-based development keeps everyone on a single main branch with short-lived feature flags. GitHub Flow is simpler: branch from main, develop, open a pull request, review, merge. The best strategy depends on release frequency and team size. Frequent releases favor trunk-based development.`
  },
  {
    id: 'article-5',
    title: 'PostgreSQL Indexing for Performance',
    content: `Database indexes dramatically speed up query performance by reducing rows scanned. B-tree indexes are the default and work for equality and range queries. Hash indexes only work for equality comparisons but are faster. Partial indexes cover only rows matching a condition, saving space. Composite indexes cover multiple columns, but column order matters. Over-indexing slows down writes, so monitor index usage with pg_stat_user_indexes.`
  }
]

const results = await pipeline(
  ARTICLES,
  (article) => agent(
    `Translate the following English tech article to Traditional Chinese. Return only the translated text, no explanations.\n\nTitle: ${article.title}\n\nContent: ${article.content}`,
    {
      label: `translate:${article.id}`,
      phase: 'Translate',
      schema: {
        type: 'object',
        properties: {
          title_zh: { type: 'string' },
          content_zh: { type: 'string' }
        },
        required: ['title_zh', 'content_zh']
      }
    }
  ),
  (prev, original, idx) => agent(
    `根據以下繁體中文技術文章，用 2 句話生成摘要。\n\n標題：${prev.title_zh}\n\n內容：${prev.content_zh}`,
    {
      label: `summarize-${idx}`,
      phase: 'Summarize',
      schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        },
        required: ['summary']
      }
    }
  ),
  (prev, original, idx) => agent(
    `從以下摘要中提取 5 個最重要的技術關鍵字（繁體中文）。\n\n${prev.summary}`,
    {
      label: `keywords-${idx}`,
      phase: 'Extract',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5 }
        },
        required: ['id', 'keywords']
      }
    }
  )
)

log(`Pipeline 完成，共處理 ${results.filter(Boolean).length} 篇文章`)
return results
