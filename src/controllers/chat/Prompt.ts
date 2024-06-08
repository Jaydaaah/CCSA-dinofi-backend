import { addMsgtoChatData, getChatData, toMessage } from "../../db/Chat";
import { Request, Response } from "express";
import { GrogStreamPrompt, GroqSuggestTitle } from "../../lib/Groq-api";
import { Logger, PrintFetch } from "../../debug/log";
import { replaceChatIdTitle } from "../../db/User";

const log = Logger("ClientPrompt");

export default async function ClientPrompt(req: Request, res: Response) {
    PrintFetch("PUT");

    const chat_id: string = req.body["chat_id"];
    const prompt: string | undefined = req.body["prompt"];

    let grogStream = "";

    if (!prompt) {
        const msg = "Please provide a prompt";
        log(msg, "Red");
        return res.status(403).send(msg).end();
    }
    log(`Received from user_id: ${chat_id}`);
    log(`Prompt Data: ${prompt}`);

    const chat_data = await getChatData(chat_id);
    if (chat_data) {
        const client_msg = toMessage(prompt, true);
        log(
            `Chat Prompt pushed to database with timestamp: ${client_msg.timestamp}`,
            "Cyan",
            { bright: ["Chat Prompt"] }
        );
        await addMsgtoChatData(chat_id, client_msg);

        log("Groq Streaming Prompt started", "Blue");
        for await (var chunk of GrogStreamPrompt(prompt)) {
            res.write(chunk);
            grogStream += chunk;
        }
        log("Groq Streaming Prompt Done", "Blue");

        const groq_msg = toMessage(grogStream, false);
        log(
            `Chat Response from Groq pushed to database with timestamp: ${groq_msg.timestamp}`,
            "Cyan",
            { bright: ["Chat Response"] }
        );
        await addMsgtoChatData(chat_id, groq_msg);
        log("Finished", "Green");
        try {
            return res.status(200).end();
        } finally {
            if (chat_data.data.length <= 0) {
                GroqSuggestTitle(prompt).then((suggest_title) => {
                    replaceChatIdTitle(chat_data.nickname, chat_data._id, suggest_title);
                })
            }
        }
    } else {
        const msg = `Error no chat_data found from chat_id: ${chat_id}`;
        log(msg, "Red");
        return res.status(400).end()
    }
}
