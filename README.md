# Parker Van Ham — Portfolio Website

A modern, full-stack portfolio website with an AI-powered chatbot, contact form, and project showcase. Built to demonstrate professional work through an interactive, performant experience.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4, next-themes (dark mode)
- **AI / RAG:** Vercel AI SDK, Upstash Vector (hybrid embeddings + BM25), OpenAI (GPT-4o-mini)
- **Rate Limiting:** Upstash Redis
- **Contact:** Resend + react-email for transactional emails
- **Validation:** Zod
- **Animation:** Motion (Framer Motion)

## Features

- **Homepage** — Hero section, typewriter roles, project highlights, skills overview
- **Projects** — Detailed project grid with modals (Sous, Z³ Wellness, El Parque, BWH, etc.)
- **AI Chatbot** — RAG-based assistant that answers questions about the portfolio using Upstash Vector hybrid retrieval and an agentic tool-calling pattern via the Vercel AI SDK
- **Contact Form** — Server action with Zod validation, honeypot, timing check, spam filtering, and rate limiting
- **Skills** — Dedicated page with structured content
- **Dark Mode** — System-aware theme toggle

## Project Structure

```
src/
├── app/              # Next.js App Router (pages, API routes, server actions)
├── components/       # Reusable UI (ui/, email/)
├── lib/              # Utilities, Upstash Vector client, constants
├── data/content/     # Plain-text RAG knowledge base (*.txt)
├── assets/           # Static images
└── scripts/          # Data ingestion for Upstash Vector
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### 1. Clone and install

```bash
git clone https://github.com/pvanham/portfolio-website.git
cd portfolio-website
npm install   # or yarn / pnpm install
```

### 2. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Required variables:

```env
# AI chatbot (OpenAI)
OPENAI_API_KEY=sk-...

# Upstash Vector (RAG retrieval)
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...

# Upstash Redis (chat rate limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Contact form (Resend)
RESEND_API_KEY=re_...
```

### 3. RAG setup (Upstash Vector)

1. Create an [Upstash Vector](https://console.upstash.com/) index with built-in embedding support (e.g. `bge-small-en-v1.5`).
2. Create an [Upstash Redis](https://console.upstash.com/) database for rate limiting.
3. Add the credentials to `.env.local`.
4. Run the ingestion script to embed content from `src/data/content/*.txt`:

```bash
npx tsx src/scripts/ingest-data.ts
```

To clear and re-ingest:

```bash
npx tsx src/scripts/ingest-data.ts --clear
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsx src/scripts/ingest-data.ts` | Ingest RAG content into Upstash Vector |

## Updating the Chatbot Knowledge Base

Edit or add `.txt` files in `src/data/content/`. Current sources:

- `about_parker.txt`
- `skills.txt`
- `home.txt`
- `contact.txt`
- `Resume.txt`
- `project-sous.txt`
- `project-portfolio-website.txt`
- `project-z3-wellness.txt`
- `project-el-parque.txt`
- `project-hospital-system.txt`

After changing content, re-run the ingestion script.

## Deployment

The project is configured for [Vercel](https://vercel.com). Add the same environment variables in your Vercel project settings and ensure Upstash Vector ingestion has been run before deploying.

## License

Private — all rights reserved.
