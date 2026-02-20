/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/chat/route.ts

import { NextRequest } from "next/server";

import { UIMessage, createUIMessageStreamResponse } from "ai";
import { toUIMessageStream } from "@ai-sdk/langchain";

import { ChatOpenAI } from "@langchain/openai";

import { PromptTemplate } from "@langchain/core/prompts";

import { Document } from "@langchain/core/documents";

import {
  RunnableSequence,
  RunnablePassthrough,
  Runnable,
} from "@langchain/core/runnables";

import { StringOutputParser } from "@langchain/core/output_parsers";

import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";

import retry from "promise-retry";

// Import hybrid retriever
import { getHybridRetriever } from "@/lib/astra";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";

interface ChatRequestBody {
  id?: string;
  messages?: UIMessage[];
  trigger?: string;
  messageId?: string;
}

const getMessageText = (message: UIMessage): string =>
  message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

const formatChatHistory = (messages: UIMessage[]): string => {
  return messages
    .map((message) => `${message.role}: ${getMessageText(message)}`)
    .join("\n");
};

// --- IMPROVED PROMPT TEMPLATES ---

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation history and a follow-up question, rephrase the follow-up to be a standalone question that captures all relevant context from the history. Preserve key details like names, topics, or specifics mentioned earlier.

Examples:
History: User: Tell me about Parker's projects. Assistant: Parker worked on the Z3 Wellness app and El Parque.
Follow-up: What was his role in the first one?
Standalone: What was Parker's role in the Z3 Wellness app?

History: {chat_history}
Follow-up: {question}
Standalone question:`;

const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `You are a helpful AI assistant for Parker Van Ham's personal portfolio website. Use the following pieces of retrieved context to answer the question. If you don't know the answer or the context doesn't contain it, just say that you don't have enough information. Be friendly, concise, and professional. Keep responses to 3-5 sentences max.

Examples:
Question: What is Parker's education?
Context: Parker graduated from WPI in Computer Science.
Answer: Parker is a recent Computer Science graduate from Worcester Polytechnic Institute (WPI).

Question: {question}
Context: {context}
Answer:`;

const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

const HYDE_PROMPT = `Please write a concise, hypothetical answer to the user's question. This answer should be a well-structured paragraph that you would expect to find in the document containing the real answer.

Question: {question}
Hypothetical Answer:`;

const hydePrompt = PromptTemplate.fromTemplate(HYDE_PROMPT);

// Sanitize query for BM25 (escape special chars)
function sanitizeQuery(query: string): string {
  query = query.replace(/[\(\)\[\]\{\}\^\$\*\?\+\|]/g, "\\$&");
  query = query.replace(/\/g/g, "");
  return query.trim();
}

// --- HELPER FUNCTIONS & MAIN LOGIC ---

export async function POST(req: NextRequest) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable.");
    }

    const body = (await req.json()) as ChatRequestBody;

    const incomingMessages = body.messages ?? [];

    const lastMessage = incomingMessages[incomingMessages.length - 1];
    const currentMessageContent = lastMessage
      ? getMessageText(lastMessage)
      : "";

    const formattedPreviousChatHistory = formatChatHistory(
      incomingMessages.slice(0, -1),
    );

    if (!currentMessageContent) {
      return Response.json(
        { error: "No message content provided." },
        { status: 400 },
      );
    }

    const llm = new ChatOpenAI({
      apiKey: openaiApiKey,
      modelName: "gpt-4o-mini",
      // Removed temperature to use default (1.0) - fixes unsupported value error
      streaming: true,
    });

    // Dynamic k based on query length
    const queryLength = currentMessageContent.length;
    const dynamicK = Math.min(10, Math.max(3, Math.floor(queryLength / 50)));

    const retriever = await retry(
      async (retryFn, attempt) => {
        try {
          return await getHybridRetriever(dynamicK);
        } catch (error) {
          console.error(`Retriever attempt ${attempt} failed:`, error);
          retryFn(error);
        }
      },
      { retries: 5, minTimeout: 1000 },
    );

    if (!retriever) {
      throw new Error("Failed to initialize retriever after retries.");
    }

    // Custom Runnable for sanitized retrieval
    class SanitizedRetriever extends Runnable<string, Document[]> {
      lc_namespace = ["custom", "retrievers", "sanitized"];
      lc_serializable = true;

      constructor(private retriever: EnsembleRetriever) {
        super();
      }

      async invoke(query: string): Promise<Document[]> {
        const sanitized = sanitizeQuery(query);
        return this.retriever.invoke(sanitized);
      }
    }

    const sanitizedRetriever = new SanitizedRetriever(retriever);

    // The chain to generate a hypothetical document for retrieval
    const hydeRetrieverChain = RunnableSequence.from([
      hydePrompt,
      llm,
      new StringOutputParser(),
      sanitizedRetriever,
    ]);

    // The main chain for processing the request
    const conversationalChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        standalone_question: (input: {
          question: string;
          chat_history: string;
        }) => {
          if (input.chat_history) {
            const condenseQuestionChain = RunnableSequence.from([
              condenseQuestionPrompt,
              llm,
              new StringOutputParser(),
            ]);
            return condenseQuestionChain.invoke(input);
          }
          return input.question;
        },
      }),
      RunnablePassthrough.assign({
        context: async (input) => {
          let docs;
          try {
            docs = await hydeRetrieverChain.invoke({
              question: input.standalone_question,
            });
          } catch (hydeError) {
            console.error(
              "HyDE chain failed; falling back to direct retrieval:",
              hydeError,
            );
            docs = await retriever.invoke(input.standalone_question);
          }
          if (docs.length === 0) {
            console.log("No docs retrieved; using standalone query fallback.");
            docs = await retriever.invoke(input.standalone_question);
          }
          return docs.map((doc) => doc.pageContent).join("\n\n");
        },
      }),
      answerPrompt,
      llm,
    ]);

    const langchainStream = await retry(
      async (retryFn, attempt) => {
        try {
          return await conversationalChain.stream({
            question: currentMessageContent,
            chat_history: formattedPreviousChatHistory,
          });
        } catch (error) {
          console.error(`Chain attempt ${attempt} failed:`, error);
          retryFn(error);
        }
      },
      { retries: 5, minTimeout: 1000 },
    );

    const stream = toUIMessageStream(langchainStream!);
    return createUIMessageStreamResponse({ stream });
  } catch (e: unknown) {
    console.error("Error in chat API:", e);
    if (
      e instanceof Error &&
      (e.message.toLowerCase().includes("timed out") ||
        e.message.includes("503") ||
        e.message.toLowerCase().includes("service unavailable"))
    ) {
      const friendlyError =
        "I'm having a bit of trouble connecting to my knowledge base right now. This can happen if it's waking up from a nap. Please try your question again in a few moments.";

      const encoder = new TextEncoder();
      const streamResponse = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(friendlyError));
          controller.close();
        },
      });

      return new Response(streamResponse, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } else {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "An unexpected error occurred. Please try again.";
      return Response.json({ error: errorMessage }, { status: 500 });
    }
  }
}
