import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RateLimitError, APIConnectionTimeoutError } from "groq-sdk";
import { AITemplate, HumanTemplate, MainTemplate, TitleCreatorTemplate } from "./Groq/Chatbot-role";
import { RagRetrieve } from "./RAG-api";
import { Chat } from "../db/Chat";

const modelLlama8b = new ChatGroq({
    apiKey: "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",
    maxTokens: 256,
    model: "llama3-8b-8192"
});

const modelGemma = new ChatGroq({
    apiKey: "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",
    maxTokens: 256,
    model: "gemma-7b-it",
});

const outputParser = new StringOutputParser();
const mainChain = MainTemplate.pipe(modelLlama8b).pipe(outputParser);

const titleSuggestChain =
    TitleCreatorTemplate.pipe(modelGemma).pipe(outputParser);

export async function GroqSuggestTitle(prompt: string) {
    try {
        const response = await titleSuggestChain.invoke({
            prompt,
        });
        return response.replace(/[^a-zA-Z0-9 ?]/g, '');
    } catch (error) {
        return prompt.split(" ").slice(0, 5).join(" ");
    }
}

function ErrorCatcher(error: any) {
    let message: string = `Something went wrong Error: ${error}`;
    if (error instanceof RateLimitError) {
        message = "Rate Limit Reached: Please Try again after a minute";
        console.error(error);
        return message;
    } else if (error instanceof APIConnectionTimeoutError) {
        message = "APIConnectionTimeoutError: Please try again in few seconds";
        console.error(error);
        return message;
    }
    console.error(error);
    throw Error(error);
}

async function generateConversation(chat_data: Chat | undefined, memory: number = 5) {
    if (!chat_data)
        return [];
    const {data} = chat_data;
    if (data) {
        const slice_data = data.slice(Math.max(data.length - memory, 0));
        let conversation = [];
        for (const {isright, text} of slice_data) {
            if (isright) {
                conversation.push(await HumanTemplate.format({text}))
            } else {
                conversation.push(await AITemplate.format({text}))
            }
        }
        return conversation;
    }
    return [];
}

export const GroqPrompt = async (prompt: string, chat_data?: Chat) => {
    const context = await RagRetrieve(prompt).then((context) => {
        return context.join("\n\n");
    });
    const conversation = chat_data ?? await generateConversation(chat_data);
    try {
        const response = await mainChain.invoke({
            context,
            conversation,
            prompt
        });
        return response;
    } catch (error) {
        let message = ErrorCatcher(error);
        return message;
    }
};

async function sleep(ms: number) {
    return await new Promise((r) => setTimeout(r, ms));
}

export async function* GrogStreamPrompt(prompt: string, chat_data?: Chat) {
    const context = await RagRetrieve(prompt).then((context) => {
        return context.join("\n\n");
    });
    const conversation = await generateConversation(chat_data);
    try {
        const response = await mainChain.stream({
            context,
            conversation,
            prompt
        });
        for await (const item of response) {
            await sleep(50);
            yield item;
        }
    } catch (error) {
        let message = ErrorCatcher(error);
        for (var chunk of message.split(" ")) {
            await sleep(50);
            yield chunk + " ";
        }
    }
}
