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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RunnablePick,
} from "@langchain/core/runnables";

import { StringOutputParser } from "@langchain/core/output_parsers";

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

// --- PROMPT TEMPLATES ---

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.



Chat History:

{chat_history}

Follow Up Input: {question}

Standalone question:`;

const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `You are a helpful AI assistant for Parker Van Ham's personal portfolio website.

Your goal is to answer questions about Parker based *only* on the provided context.

If the context doesn't contain the answer, state that you don't have enough information from the website.

Be friendly, concise, and professional.



CONTEXT:

{context}



QUESTION:

{question}



ANSWER:

`;

const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

// New template for HyDE

const HYDE_PROMPT = `Please write a concise, hypothetical answer to the user's question. This answer should be a well-structured paragraph that you would expect to find in the document containing the real answer.



Question: {question}

Hypothetical Answer:`;

const hydePrompt = PromptTemplate.fromTemplate(HYDE_PROMPT);

// --- HELPER FUNCTIONS & MAIN LOGIC ---

async function getAstraRetriever() {
  const googleApiKey = process.env.GOOGLE_API_KEY!;

  const astraToken = process.env.ASTRA_DB_APPLICATION_TOKEN!;

  const astraEndpoint = process.env.ASTRA_DB_API_ENDPOINT!;

  const astraKeyspace = process.env.ASTRA_DB_KEYSPACE!;

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
      vector: { dimension: 768, metric: "cosine" },
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
      throw new Error("Missing GOOGLE_API_KEY environment variable.");
    }

    const body = (await req.json()) as ChatRequestBody;

    const incomingMessages = body.messages ?? [];

    const currentMessageContent =
      incomingMessages[incomingMessages.length - 1]?.content;

    const formattedPreviousChatHistory = formatChatHistory(
      incomingMessages.slice(0, -1),
    );

    if (!currentMessageContent) {
      return Response.json(
        { error: "No message content provided." },

        { status: 400 },
      );
    }

    const llm = new ChatGoogleGenerativeAI({
      apiKey: googleApiKey,

      model: "gemini-1.5-flash-latest",

      temperature: 0.2,

      streaming: true,
    });

    const retriever = await getAstraRetriever();

    // The chain to generate a hypothetical document for retrieval

    const hydeRetrieverChain = RunnableSequence.from([
      hydePrompt,

      llm,

      new StringOutputParser(),

      retriever,
    ]);

    // The main chain for processing the request

    const conversationalChain = RunnableSequence.from([
      // Pass through original inputs and add a 'standalone_question' key

      RunnablePassthrough.assign({
        standalone_question: (input: {
          question: string;

          chat_history: string;
        }) => {
          if (input.chat_history) {
            // If history exists, condense the question

            const condenseQuestionChain = RunnableSequence.from([
              condenseQuestionPrompt,

              llm,

              new StringOutputParser(),
            ]);

            return condenseQuestionChain.invoke(input);
          }

          // Otherwise, use the original question

          return input.question;
        },
      }),

      // Use the 'standalone_question' to retrieve context via the HyDE chain

      RunnablePassthrough.assign({
        context: (input) =>
          hydeRetrieverChain

            .invoke({ question: input.standalone_question })

            .then((docs: Document[]) =>
              docs.map((doc) => doc.pageContent).join("\n\n"),
            ),
      }),

      // Finally, generate the answer using the original question and retrieved context

      answerPrompt,

      llm,
    ]);

    const langchainStream = await conversationalChain.stream({
      question: currentMessageContent,

      chat_history: formattedPreviousChatHistory,
    });

    const vercelAIStream = LangChainAdapter.toDataStream(langchainStream);

    return new Response(vercelAIStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
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
