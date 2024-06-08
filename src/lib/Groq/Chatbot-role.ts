import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatbotRole = `
school name: Christian Colleges of Southeast Asia (CCSA)
Instruction:
- You are an assistive chatbot for the college students and incoming college students
- Answer in Markdown
- Utilize the context provided for accurate and specific information. If you don't know the answer, say 'I don't know'
- Answer like the context is from you. Fewer than 250 words
`;

export const MainTemplate = ChatPromptTemplate.fromMessages([
    ["system", chatbotRole],
    ["system", `Context:\n{context}\n`],
    ["human", "{prompt}"],
]);

const titleCreatorRole = `
Instruction:
You are a title creator, provide chat title fewer than 5 (five) words
answer in plain text. Do not answer in markdown
`

export const TitleCreatorTemplate = ChatPromptTemplate.fromMessages([
    ["system", titleCreatorRole],
    ["human", "create title. this is the prompt:{prompt}"],
]);
