// src/scripts/test-rag.ts
import { getHybridRetriever } from "@/lib/astra";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import * as dotenv from "dotenv";
import path from "path";

// Optional: Langsmith for tracing
if (process.env.LANGSMITH_API_KEY) {
  process.env.LANGSMITH_TRACING_V2 = "true";
  process.env.LANGSMITH_PROJECT = "portfolio-rag-test";
}

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Sample queries and ground truth (add more based on your content)
const testCases = [
  {
    query: "Who is Parker Van Ham?",
    groundTruth: ["Computer Science graduate", "WPI", "full-stack developer"],
  },
  {
    query: "What projects has Parker worked on?",
    groundTruth: [
      "Z3 Wellness Sleep App",
      "El Parque Redevelopment",
      "portfolio website",
    ],
  },
  // Add more, e.g., follow-up simulation with history
  {
    query: "More details on the sleep app?",
    history: "User: What projects? Assistant: Z3 Wellness, etc.",
    groundTruth: ["Full-Stack Developer", "React", "Node.js"],
  },
];

const ANSWER_TEMPLATE = `You are a helpful AI assistant for Parker Van Ham's personal portfolio website. Use the following pieces of retrieved context to answer the question. If you don't know the answer or the context doesn't contain it, just say that you don't have enough information. Be friendly, concise, and professional. Keep responses to 3-5 sentences max.

Question: {question}
Context: {context}
Answer:`;

const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

async function testRAG() {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    console.error("Missing GOOGLE_API_KEY.");
    return;
  }

  const llm = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: "gemini-1.5-flash-latest",
    temperature: 0.5,
  });

  const retriever = await getHybridRetriever(5); // Test with fixed k

  for (const test of testCases) {
    console.log(`\nTesting query: "${test.query}"`);

    // Simulate retrieval
    const docs = await retriever.invoke(test.query);
    const context = docs.map((doc: Document) => doc.pageContent).join("\n\n");

    // Generation chain
    const chain = RunnableSequence.from([
      answerPrompt,
      llm,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke({ question: test.query, context });

    console.log("Response:", response);

    // Simple eval: Check if ground truth keywords are in response
    const pass = test.groundTruth.every((kw) =>
      response.toLowerCase().includes(kw.toLowerCase()),
    );
    console.log("Pass:", pass ? "Yes" : "No");
  }
}

testRAG().catch(console.error);
