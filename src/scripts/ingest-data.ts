// src/scripts/ingest-data.ts
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";
import { TextLoader } from "langchain/document_loaders/fs/text";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

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
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const astraToken = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const astraEndpoint = process.env.ASTRA_DB_API_ENDPOINT;
  const astraKeyspace = process.env.ASTRA_DB_KEYSPACE;

  if (!googleApiKey || !astraToken || !astraEndpoint || !astraKeyspace) {
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
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(rawDocs);
  console.log(
    `Split ${rawDocs.length} documents into ${splitDocs.length} chunks.`,
  );

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: googleApiKey,
    modelName: "text-embedding-004",
  });
  console.log("Initialized Google Gemini Embeddings.");

  // Explicitly type astraConfig with AstraLibArgs
  const astraConfig: AstraLibArgs = {
    token: astraToken,
    endpoint: astraEndpoint,
    collection: "portfolio_embeddings", // Name your collection
    namespace: astraKeyspace,
    collectionOptions: {
      vector: {
        dimension: 768, // text-embedding-004 produces 768-dimension vectors
        metric: "cosine", // This will now be correctly checked against the literal types
      },
    },
  };

  try {
    console.log("Connecting to AstraDB and adding documents...");
    await AstraDBVectorStore.fromDocuments(splitDocs, embeddings, astraConfig);
    console.log(
      `Successfully added ${splitDocs.length} chunks to AstraDB collection "portfolio_embeddings".`,
    );
  } catch (error) {
    console.error("Error interacting with AstraDB:", error);
  }
}

main().catch(console.error);
