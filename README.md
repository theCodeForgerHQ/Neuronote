# Neuronote

**Your Second Brain, Reimagined**  
Neuronote is an AI-native note system built for people who think in fragments and need structure fast. It takes raw thought dumps, atomizes them into clean, typed notes, stores semantic embeddings, and lets you retrieve or summarize context with low-friction search. Most note apps optimize for storage. Neuronote optimizes for retrieval and action.

## Technical Highlights

- AI extraction pipeline that converts free text into typed atomic notes.
- Semantic search with vector embeddings + keyword/tag boosting.
- AI report/summarization endpoint over personal note context.
- Auth-gated multi-user data model with Clerk.
- Postgres + Drizzle ORM schema designed for typed note metadata.
- Offline-aware UX with local cache fallback for read/search continuity.
- App Router + API routes split by capability (`extract`, `notes`, `query-embedding`, `summarize`, `task-toggle`, `delete`).

## Stack

- Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Radix UI
- Backend: Next.js Route Handlers, Drizzle ORM, PostgreSQL
- Auth: Clerk
- AI: Google Gemini (`gemini-2.0-flash`) + Cohere embeddings (`embed-english-v3.0`)
- DX: ESLint, Drizzle Kit

## Architecture

```text
User Input
  -> /api/extract
     -> Gemini: atomize + classify + enrich note metadata
     -> Cohere: generate document embeddings
     -> Postgres (Drizzle): persist typed notes + vectors

Search Query
  -> /api/query-embedding (Cohere query embedding)
  -> client-side cosine similarity over cached note vectors
  -> keyword/tag/type boost + threshold filtering

Summary Request
  -> /api/summarize (Gemini)
  -> markdown report synthesized from filtered note context
```

## Data Model (Core)

Each note persists:
- `note` text
- `type` (task, idea, fact, reminder, etc.)
- `people[]`, `place[]`, `tags[]`
- optional `priority`, `timeRef`
- task state (`isDone`)
- `embedding[]` vector for semantic retrieval

Schema file: `src/db/schema.ts`

## Local Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment

Create `.env.local`:

```bash
DATABASE_URL=
GEMINI_API_KEY=
COHERE_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 3. Run migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Start dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Surface

- `POST /api/extract` -> Parse input into typed notes, embed, persist.
- `GET /api/notes` -> Fetch current user notes.
- `POST /api/query-embedding` -> Generate search query embedding.
- `POST /api/summarize` -> Generate markdown report from selected notes.
- `PATCH /api/task-toggle` -> Toggle task completion.
- `DELETE /api/delete` -> Delete note by user + content + timestamp.

## Engineering Style

I focus on shipping systems that are:
- Product-driven: every technical choice maps to a user friction point.
- Pragmatic with AI: structured outputs, explicit validation, typed persistence.
- Performance-aware: local caching, thresholded retrieval, minimal API surface.
- Maintainable: typed boundaries, separated route responsibilities, schema-first thinking.

## License

MIT
