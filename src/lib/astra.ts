// src/lib/astra.ts
"use server"; // This marks the file as server-only, resolving Node module imports

import { OpenAIEmbeddings } from "@langchain/openai"; // New: For OpenAI embeddings
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";
import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from "fs/promises";
import path from "path";

// Singleton instances
let embeddingsInstance: OpenAIEmbeddings | null = null;
let vectorStoreInstance: AstraDBVectorStore | MemoryVectorStore | null = null;
let bm25RetrieverInstance: BM25Retriever | null = null;
let hybridRetrieverInstance: EnsembleRetriever | null = null;

// Load and split docs once
async function loadAndSplitDocs() {
  const contentDir = path.resolve(process.cwd(), "src/data/content");
  const documents: Document[] = [];
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
    }
  }
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
  });
  return splitter.splitDocuments(documents);
}

export async function getHybridRetriever(k: number = 5) {
  const openaiApiKey = process.env.OPENAI_API_KEY!;
  const astraToken = process.env.ASTRA_DB_APPLICATION_TOKEN!;
  const astraEndpoint = process.env.ASTRA_DB_API_ENDPOINT!;
  const astraKeyspace = process.env.ASTRA_DB_KEYSPACE!;
  const useInMemory = process.env.USE_IN_MEMORY_STORE === "true";

  if (!embeddingsInstance) {
    embeddingsInstance = new OpenAIEmbeddings({
      apiKey: openaiApiKey,
      modelName: "text-embedding-3-small",
    });
    console.log("Initialized OpenAI Embeddings singleton.");
  }

  if (!vectorStoreInstance) {
    if (useInMemory) {
      const splitDocs = await loadAndSplitDocs();
      vectorStoreInstance = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddingsInstance,
      );
      console.log("Initialized MemoryVectorStore (dev mode).");
    } else {
      const astraConfig: AstraLibArgs = {
        token: astraToken,
        endpoint: astraEndpoint,
        collection: "portfolio_embeddings",
        namespace: astraKeyspace,
        collectionOptions: {
          vector: { dimension: 1536, metric: "cosine" }, // Updated dim for text-embedding-3-small
        },
      };
      vectorStoreInstance = new AstraDBVectorStore(
        embeddingsInstance,
        astraConfig,
      );
      await vectorStoreInstance.initialize();
      console.log("Initialized AstraDB VectorStore singleton.");
    }
  }

  if (!bm25RetrieverInstance || !hybridRetrieverInstance) {
    const splitDocs = await loadAndSplitDocs();
    bm25RetrieverInstance = BM25Retriever.fromDocuments(splitDocs, { k });
    console.log("Initialized BM25Retriever singleton.");

    const vectorRetriever = vectorStoreInstance.asRetriever({
      k,
      searchType: "similarity",
    });

    hybridRetrieverInstance = new EnsembleRetriever({
      retrievers: [bm25RetrieverInstance, vectorRetriever],
      weights: [0.4, 0.6],
    });
    console.log("Initialized Hybrid EnsembleRetriever singleton.");
  }

  return hybridRetrieverInstance!;
}
