/**
 * CLI script — chunks .txt files from data/content/ and upserts them into Upstash Vector.
 * Usage: npx tsx src/scripts/ingest-data.ts [--clear]
 */

import { Index } from "@upstash/vector";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const contentDir = path.resolve(__dirname, "../data/content");

interface ChunkMetadata extends Record<string, unknown> {
  text: string;
  source: string;
}

function findBreakPoint(
  text: string,
  start: number,
  maxPos: number,
): number {
  const minPos = start + Math.floor((maxPos - start) * 0.5);

  const paragraphBreak = text.lastIndexOf("\n\n", maxPos);
  if (paragraphBreak >= minPos) return paragraphBreak + 2;

  const sentenceBreak = text.lastIndexOf(". ", maxPos);
  if (sentenceBreak >= minPos) return sentenceBreak + 2;

  const wordBreak = text.lastIndexOf(" ", maxPos);
  if (wordBreak >= minPos) return wordBreak + 1;

  return maxPos;
}

function splitText(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    if (start + chunkSize >= text.length) {
      const chunk = text.slice(start).trim();
      if (chunk.length > 0) chunks.push(chunk);
      break;
    }

    const breakAt = findBreakPoint(text, start, start + chunkSize);
    const chunk = text.slice(start, breakAt).trim();
    if (chunk.length > 0) chunks.push(chunk);

    start = Math.max(start + 1, breakAt - chunkOverlap);
  }

  return chunks;
}

async function main() {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!url || !token) {
    console.error(
      "Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN. Check your .env.local file.",
    );
    process.exit(1);
  }

  const index = new Index<ChunkMetadata>({ url, token });

  if (process.argv.includes("--clear")) {
    console.log("Clearing existing index...");
    await index.reset();
    console.log("Index cleared.");
  }

  console.log("Starting data ingestion...");

  const files = await fs.readdir(contentDir);
  const txtFiles = files.filter((f) => path.extname(f) === ".txt");

  if (txtFiles.length === 0) {
    console.log("No .txt files found in", contentDir);
    return;
  }

  let totalChunks = 0;

  for (const file of txtFiles) {
    const filePath = path.join(contentDir, file);
    const content = await fs.readFile(filePath, "utf-8");
    const source = file.replace(".txt", "");
    const chunks = splitText(content, 800, 200);

    console.log(`  ${file}: ${chunks.length} chunks`);

    const vectors = chunks.map((chunk, i) => ({
      id: `${source}-${i}`,
      data: chunk,
      metadata: { text: chunk, source },
    }));

    const batchSize = 50;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
    }

    totalChunks += chunks.length;
  }

  console.log(
    `Successfully ingested ${totalChunks} chunks from ${txtFiles.length} files.`,
  );
}

main().catch(console.error);
