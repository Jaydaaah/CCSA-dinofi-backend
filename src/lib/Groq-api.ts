import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import role_script from "./Groq/script-about";
import { RateLimitError, APIConnectionTimeoutError } from "groq-sdk";

const model = new ChatGroq({
    apiKey: "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",
    maxTokens: 512,
    model: "llama3-8b-8192",
});

const template = ChatPromptTemplate.fromMessages([
    ["system", role_script],
    ["human", "{prompt}"],
]);
const outputParser = new StringOutputParser();
const chain = template.pipe(model).pipe(outputParser);

export const GroqPrompt = async (prompt: string) => {
    const response = await chain.invoke({
        prompt,
    });
    return response;
};

async function sleep(ms: number) {
    return await new Promise((r) => setTimeout(r, ms));
}

export async function* GrogStreamPrompt(prompt: string) {
    try {
        const response = await chain.stream({
            prompt,
        });
        for await (const item of response) {
            await sleep(50);
            yield item;
        }
    } catch (error) {
        let message: string = `Something went wrong Error: ${error}`;
        if (error instanceof RateLimitError) {
            message = "Rate Limit Reached: Please Try again after a minute";
        } else if (error instanceof APIConnectionTimeoutError) {
            message =
                "APIConnectionTimeoutError: Please try again in few seconds";
        }
        for (var chunk of message.split(" ")) {
            yield chunk + " ";
        }
    }
}
