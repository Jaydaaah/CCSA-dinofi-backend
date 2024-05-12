import { CompletionCreateParams } from "groq-sdk/resources/chat/completions.mjs";

import about_script from "./script-about";

const system_content = {
    about: about_script,
};

const models = {
    llama: "llama3-8b-8192",
    gemma: "gemma-7b-it",
};

const system_intention = `
CCSA alternative names:
Christian
College
School

important: if intention doesn't exist reply with codexxx
important: if question not related to School or CCSA reply with codexxx

Intention list:
codexxx. NONE OF THE CHOICES.
code001. CCSA DESCRIPTION,
code002. PROGRAM OFFERED,
code003. ADMISSION REQUIREMENTS,
code004. SCHOLARSHIP OFFERED IN CCSA,
code005. SCHOLARSHIP GRANT SCORE,
code006. OTHER SCHOLARSHIP,
code007. ENROLLMENT IN CCSA,
code008. CONTACT INFO OF CCSA, CHAT CCSA,
code009. ENROLLMENT CCSA,
code010. Vision Mission of CCSA,
code011. ADDRESS OF CCSA
codexxx. NONE OF THE CHOICES.
`;

function AskIntentionPrompt(
    prompt: string,
    model: "llama" | "gemma" = "llama"
) {
    const messages: CompletionCreateParams.Message[] = [];
    messages.push({
        role: "system",
        content: system_intention,
    });
    messages.push({
        role: "user",
        content: `What is the intention of this question: ${prompt} reply with code + three digit number only. example: code001`,
    });
    return {
        messages,
        model: models[model],
        max_tokens: 3,
    };
}

function createGroqPromptParams(
    prompt: string,
    model: "llama" | "gemma" = "llama",
    system_content_mode?: "normal" | "about"
) {
    const messages: CompletionCreateParams.Message[] = [];

    if (system_content_mode && system_content_mode !== "normal") {
        messages.push({
            role: "system",
            content: system_content[system_content_mode],
        });
    }

    messages.push({
        role: "user",
        content: prompt,
    });
    return {
        messages,
        model: models[model],
        max_tokens: 512,
    };
}
