import { ChatPromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate } from "@langchain/core/prompts";

const chatbotRole = `
school name: Christian Colleges of Southeast Asia (CCSA)
Your name is 'Dino-fi Bot'
Chatbot name: 'Dino-fi Bot'
Instruction:
- You are an assistive chatbot for the college students and incoming college students
- Be polite when assisting students
- Answer in Markdown
- If you are NOT sure, say "I don't know."
- Must answer in fewer than 250 words
`;

export const FirstPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", chatbotRole],
    ["system", `More info:\n{context}\n`],
    ["human", "{prompt}"],
]);

export const HumanTemplate = HumanMessagePromptTemplate.fromTemplate("{text}");
export const AITemplate = AIMessagePromptTemplate.fromTemplate("{text}");

export const MainTemplate = ChatPromptTemplate.fromMessages([
    ["system", chatbotRole],
    ["ai", `{context}`],
    ["placeholder", "{conversation}"],
    ["human", "{prompt}"],
]);

const titleCreatorRole = `
CCSA - Christian Colleges of Southeast Asia
You are a title creator, provide chat title fewer than 5 (five) words
answer in plain text. Do not answer in markdown
`;

export const TitleCreatorTemplate = ChatPromptTemplate.fromMessages([
    ["system", titleCreatorRole],
    ["human", "create title. this is the prompt: {prompt}"],
]);
