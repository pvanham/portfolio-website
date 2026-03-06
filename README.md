# Parker Van Ham — Portfolio Website

A modern, full-stack portfolio website with an AI-powered chatbot, contact form, and project showcase. Built to demonstrate professional work through an interactive, performant experience.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4, next-themes (dark mode)
- **AI / RAG:** Vercel AI SDK, LangChain, AstraDB (vector store), OpenAI (GPT-4o-mini, text-embedding-3-small)
- **Contact:** Resend + react-email for transactional emails
- **Validation:** Zod
- **Animation:** Motion (Framer Motion)

## Features

- **Homepage** — Hero section, typewriter roles, project highlights, skills overview
- **Projects** — Detailed project grid with modals (Z³ Wellness, El Parque, BWH, etc.)
- **AI Chatbot** — RAG-based assistant that answers questions about the portfolio using hybrid retrieval (BM25 + vector, 40/60 weights) and HyDE
- **Contact Form** — Server action with Zod validation, honeypot, timing check, spam filtering, and rate limiting
- **Resume & Skills** — Dedicated pages with structured content
- **Dark Mode** — System-aware theme toggle

## Project Structure

```
src/
├── app/              # Next.js App Router (pages, API routes, server actions)
├── components/       # Reusable UI (ui/, email/)
├── lib/              # Utilities, AstraDB setup, constants
├── data/content/     # Plain-text RAG knowledge base (*.txt)
├── assets/           # Static images
└── scripts/          # Data ingestion for AstraDB
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### 1. Clone and install

```bash
git clone https://github.com/pvanham/portfolio-website.git
cd portfolio-website
yarn install   # or npm install / pnpm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
# Required for AI chatbot
OPENAI_API_KEY=sk-...

# Required for AstraDB (RAG vector store)
ASTRA_DB_APPLICATION_TOKEN=AstraCS:...
ASTRA_DB_API_ENDPOINT=https://...-us-east1.apps.astra.datastax.com
ASTRA_DB_KEYSPACE=default_keyspace

# Required for contact form
RESEND_API_KEY=re_...

# Optional: use in-memory vector store instead of AstraDB (dev only)
# USE_IN_MEMORY_STORE=true
```

### 3. RAG setup (AstraDB)

If using AstraDB:

1. Create a [DataStax Astra DB](https://astra.datastax.com/) database.
2. Create a keyspace and note the API endpoint and application token.
3. Run the ingestion script to embed content from `src/data/content/*.txt`:

```bash
yarn tsx src/scripts/ingest-data.ts
```

To clear and re-ingest:

```bash
yarn tsx src/scripts/ingest-data.ts --clear
```

For local development without AstraDB, set `USE_IN_MEMORY_STORE=true` in `.env.local`. The app will load and embed content from disk at runtime (no ingestion needed).

### 4. Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn tsx src/scripts/ingest-data.ts` | Ingest RAG content into AstraDB |

## Updating the Chatbot Knowledge Base

Edit or add `.txt` files in `src/data/content/`. Current sources:

- `about_parker.txt`
- `skills.txt`
- `projects.txt`
- `Resume.txt`
- `home.txt`
- `contact.txt`

After changing content, re-run the ingestion script (or restart the dev server if using `USE_IN_MEMORY_STORE`).

## Deployment

The project is configured for [Vercel](https://vercel.com). Add the same environment variables in your Vercel project settings. Ensure AstraDB ingestion has been run before deploying, or use `USE_IN_MEMORY_STORE` only for ephemeral preview deployments.

## License

Private — all rights reserved.
