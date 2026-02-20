// src/scripts/ingest-data.ts
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";
import { TextLoader } from "langchain/document_loaders/fs/text";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import retry from "promise-retry";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const contentDir = path.resolve(__dirname, "../data/content");

async function loadAndProcessDocuments() {
  const documents: Document[] = [];
  try {
    const files = await fs.readdir(contentDir);
    for (const file of files) {
      if (path.extname(file) === ".txt") {
        const filePath = path.join(contentDir, file);
        const loader = new TextLoader(filePath);
        const docs = await loader.load();
        docs.forEach((doc) => {
          doc.metadata = { ...doc.metadata, source: file.replace(".txt", "") };
          documents.push(doc);
        });
        console.log(`Loaded content from ${file}`);
      }
    }
  } catch (error) {
    console.error("Error loading documents:", error);
    return [];
  }
  return documents;
}

async function main() {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const astraToken = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const astraEndpoint = process.env.ASTRA_DB_API_ENDPOINT;
  const astraKeyspace = process.env.ASTRA_DB_KEYSPACE;

  if (!openaiApiKey || !astraToken || !astraEndpoint || !astraKeyspace) {
    console.error(
      "Missing required environment variables. Check your .env.local file.",
    );
    return;
  }

  console.log("Starting data ingestion...");

  const rawDocs = await loadAndProcessDocuments();
  if (rawDocs.length === 0) {
    console.log("No documents found to process.");
    return;
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800, // Tuned down for better relevance
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(rawDocs);
  console.log(
    `Split ${rawDocs.length} documents into ${splitDocs.length} chunks.`,
  );

  const embeddings = new OpenAIEmbeddings({
    apiKey: openaiApiKey,
    modelName: "text-embedding-3-small", // Updated embedding model
  });
  console.log("Initialized OpenAI Embeddings.");

  const astraConfig: AstraLibArgs = {
    token: astraToken,
    endpoint: astraEndpoint,
    collection: "portfolio_embeddings",
    keyspace: astraKeyspace,
    collectionOptions: {
      vector: {
        dimension: 1536, // Updated dimension for text-embedding-3-small
        metric: "cosine",
      },
    },
  };

  await retry(
    async (retryFn, attempt) => {
      try {
        const vectorStore = new AstraDBVectorStore(embeddings, astraConfig);
        await vectorStore.initialize();

        // Check for existing data (with try-catch to handle non-existent collection)
        let hasData = false;
        try {
          const existingDocs = await vectorStore.similaritySearch(
            "test dummy query",
            1,
          );
          hasData = existingDocs.length > 0;
        } catch (checkError) {
          console.error("Error checking for existing data:", checkError);
          console.log("Collection does not exist yet; treating as empty.");
        }

        // Handle --clear flag
        const clearFlag = process.argv.includes("--clear");
        if (clearFlag) {
          // Fetch all docs (blank query, high k assuming small DB)
          const allDocs = await vectorStore.similaritySearch(" ", 100); // Adjust 100 if more chunks
          const ids = allDocs.map((doc) => doc.metadata._id as string);
          if (ids.length > 0) {
            await vectorStore.delete({ ids });
            console.log(`Deleted ${ids.length} documents from collection.`);
          } else {
            console.log("No documents to delete.");
          }
        } else if (hasData) {
          console.log(
            "Collection already has data; skipping ingestion to avoid duplicates. Use --clear to overwrite.",
          );
          return;
        }

        console.log("Connecting to AstraDB and adding documents...");
        await AstraDBVectorStore.fromDocuments(
          splitDocs,
          embeddings,
          astraConfig,
        );
        console.log(
          `Successfully added ${splitDocs.length} chunks to AstraDB collection "portfolio_embeddings".`,
        );
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        retryFn(error);
      }
    },
    { retries: 3, minTimeout: 1000 },
  );
}

main().catch(console.error);
