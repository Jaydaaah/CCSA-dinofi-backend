import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RateLimitError, APIConnectionTimeoutError } from "groq-sdk";
import { MainTemplate, TitleCreatorTemplate } from "./Groq/Chatbot-role";
import { RagRetrieve } from "./RAG-api";

const modelLlama8b = new ChatGroq({
    apiKey: "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",
    maxTokens: 256,
    model: "llama3-8b-8192",
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
    } else if (error instanceof APIConnectionTimeoutError) {
        message = "APIConnectionTimeoutError: Please try again in few seconds";
    }
    return message;
}

export const GroqPrompt = async (prompt: string) => {
    const context = await RagRetrieve(prompt).then((context) => {
        return context.join("\n\n");
    });
    try {
        const response = await mainChain.invoke({
            context,
            prompt,
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

export async function* GrogStreamPrompt(prompt: string) {
    const context = await RagRetrieve(prompt).then((context) => {
        return context.join("\n\n");
    });
    try {
        const response = await mainChain.stream({
            context,
            prompt,
        });
        for await (const item of response) {
            await sleep(50);
            yield item;
        }
    } catch (error) {
        let message = ErrorCatcher(error);
        for (var chunk of message.split(" ")) {
            yield chunk + " ";
        }
    }
}
