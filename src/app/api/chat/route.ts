// src/app/api/chat/route.ts
import { NextRequest } from "next/server";
import { Message as VercelChatMessage, LangChainAdapter } from "ai";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import {
  RunnableSequence,
  RunnablePassthrough,
  RunnablePick,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers"; // Re-added for the condense question chain
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";

export const runtime = "edge";

interface ChatRequestBody {
  messages?: VercelChatMessage[];
}

const formatChatHistory = (messages: VercelChatMessage[]): string => {
  return messages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");
};

// Template for condensing a follow-up question and chat history into a standalone question
const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

// Main answer generation template
const ANSWER_TEMPLATE = `You are a helpful AI assistant for Parker Van Ham's personal portfolio website.
Your goal is to answer questions about Parker based *only* on the provided context and chat history.
If the context doesn't contain the answer, state that you don't have enough information from the website.
Be friendly, concise, and professional. Mention that the information comes from Parker's website.

CONTEXT:
{context}

CHAT HISTORY:
{chat_history}

QUESTION:
{question}

ANSWER:
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

async function getAstraRetriever() {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const astraToken = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const astraEndpoint = process.env.ASTRA_DB_API_ENDPOINT;
  const astraKeyspace = process.env.ASTRA_DB_KEYSPACE;

  if (!googleApiKey || !astraToken || !astraEndpoint || !astraKeyspace) {
    throw new Error(
      "Missing required environment variables for AstraDB or Google API. Ensure they are set in .env.local or your hosting provider.",
    );
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: googleApiKey,
    modelName: "text-embedding-004",
  });

  const astraConfig: AstraLibArgs = {
    token: astraToken,
    endpoint: astraEndpoint,
    collection: "portfolio_embeddings",
    namespace: astraKeyspace,
    collectionOptions: {
      // Keep this consistent with ingestion script
      vector: {
        dimension: 768,
        metric: "cosine",
      },
    },
  };

  const vectorStore = new AstraDBVectorStore(embeddings, astraConfig);
  await vectorStore.initialize();
  return vectorStore.asRetriever(3);
}

export async function POST(req: NextRequest) {
  try {
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error(
        "Missing GOOGLE_API_KEY environment variable. Ensure it's set in .env.local or your hosting provider.",
      );
    }

    const body = (await req.json()) as ChatRequestBody;
    const incomingMessages = body.messages ?? [];

    if (incomingMessages.length === 0) {
      return Response.json({ error: "No messages provided." }, { status: 400 });
    }

    const currentMessage = incomingMessages[incomingMessages.length - 1];
    if (!currentMessage || typeof currentMessage.content !== "string") {
      return Response.json(
        { error: "Invalid last message format." },
        { status: 400 },
      );
    }
    const currentMessageContent = currentMessage.content;
    const formattedPreviousChatHistory = formatChatHistory(
      incomingMessages.slice(0, -1),
    );

    const llm = new ChatGoogleGenerativeAI({
      apiKey: googleApiKey,
      model: "gemini-1.5-flash-latest",
      temperature: 0.2, // Slightly lower temperature for more factual rephrasing/answering
      streaming: true,
    });

    const retriever = await getAstraRetriever();

    // Chain to condense the current question and chat history into a standalone question
    const condenseQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      llm,
      new StringOutputParser(),
    ]);

    // Chain to retrieve context based on a question
    const retrieveContextChain = retriever.pipe((docs: Document[]) =>
      docs.map((doc) => doc.pageContent).join("\n\n"),
    );

    // Main conversational chain
    const conversationalChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        // If there's chat history, condense the question. Otherwise, use the original question.
        // The output of this step will be the 'standalone_question'
        standalone_question: (input: {
          question: string;
          chat_history: string;
        }) => {
          if (input.chat_history) {
            return condenseQuestionChain;
          }
          return new RunnablePick("question"); // Pass through the original question
        },
      }),
      RunnablePassthrough.assign({
        // Retrieve context using the 'standalone_question'
        context: new RunnablePick("standalone_question").pipe(
          retrieveContextChain,
        ),
      }),
      answerPrompt, // Uses original question, history, and new context
      llm, // LLM for generating the final answer
    ]);

    const langchainStream = await conversationalChain.stream({
      question: currentMessageContent,
      chat_history: formattedPreviousChatHistory,
    });

    const vercelAIStream = LangChainAdapter.toDataStream(langchainStream);

    return new Response(vercelAIStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (e: unknown) {
    console.error("Error in chat API:", e);
    let errorMessage = "An unexpected error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
