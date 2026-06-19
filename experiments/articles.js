  export const ARTICLES = [
    {
      id: 'article-1',
      title: 'Understanding Promises in JavaScript',
      content: `Promises are objects representing the eventual completion or failure of an asynchronous
  operation. A Promise is in one of these states: pending, fulfilled, or rejected. The Promise constructor
  takes a function called the executor, which receives resolve and reject functions. Using .then()
  chains, you can handle fulfilled values, while .catch() handles rejections. Promise.all() runs multiple
  promises in parallel and resolves when all complete.`
    },
    {
      id: 'article-2',
      title: 'Docker Containers vs Virtual Machines',
      content: `Containers and virtual machines are both virtualization technologies, but they differ
  fundamentally. VMs include a full operating system, making them heavy but highly isolated. Containers
  share the host OS kernel, making them lightweight and fast to start. Docker popularized containers by
  providing a standard format. Containers are ideal for microservices architectures where many small
  services run simultaneously on the same host.`
    },
    {
      id: 'article-3',
      title: 'Introduction to REST API Design',
      content: `REST (Representational State Transfer) is an architectural style for distributed systems.
  RESTful APIs use HTTP methods: GET retrieves resources, POST creates them, PUT updates them, and DELETE
  removes them. Resources are identified by URLs, and responses typically use JSON format. Good REST APIs
  are stateless, meaning each request contains all information needed. Versioning (e.g., /api/v1/) helps
  maintain backward compatibility.`
    },
    {
      id: 'article-4',
      title: 'Git Branching Strategies for Teams',
      content: `Effective branching strategies help teams collaborate without conflicts. GitFlow uses
  dedicated branches for features, releases, and hotfixes. Trunk-based development keeps everyone on a
  single main branch with short-lived feature flags. GitHub Flow is simpler: branch from main, develop,
  open a pull request, review, merge. The best strategy depends on release frequency and team size.
  Frequent releases favor trunk-based development.`
    },
    {
      id: 'article-5',
      title: 'PostgreSQL Indexing for Performance',
      content: `Database indexes dramatically speed up query performance by reducing rows scanned. B-tree
  indexes are the default and work for equality and range queries. Hash indexes only work for equality
  comparisons but are faster. Partial indexes cover only rows matching a condition, saving space.
  Composite indexes cover multiple columns, but column order matters. Over-indexing slows down writes, so
  monitor index usage with pg_stat_user_indexes.`
    }
  ]