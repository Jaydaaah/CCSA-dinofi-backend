import { addMsgtoChatData, toMessage } from "../db/Chat";
import { Request, Response } from "express";
import { GrogStreamPrompt } from "../lib/Groq-api";
import { Logger, PrintFetch } from "../debug/log";

const log = Logger("ClientPrompt");

export default async function ClientPrompt(req: Request, res: Response) {
    PrintFetch("PUT");

    const user_id: string = req.body["user_id"];
    const prompt: string | undefined = req.body["prompt"];

    const prefix: string = req.body["prefix"] ?? "";
    const nickname: string = req.body["nickname"] ?? "";
    const name = `${prefix} ${nickname}`;

    let grogStream = "";

    if (!prompt) {
        const msg = "Please provide a prompt";
        log(msg, "Red")
        return res.status(403).send(msg).end();
    }
    log(`Received from user_id: ${user_id}`);
    log(`Prompt Data: ${prompt}`);

    const client_msg = toMessage(prompt, true);
    log(`Chat Prompt pushed to database with timestamp: ${client_msg.timestamp}`, "Cyan", {bright: ["Chat Prompt"]});
    await addMsgtoChatData(user_id, client_msg);

    log("Groq Streaming Prompt started", "Blue");
    for await (var chunk of GrogStreamPrompt(prompt)) {
        res.write(chunk);
        grogStream += chunk;
    }
    log("Groq Streaming Prompt Done", "Blue");

    const groq_msg = toMessage(grogStream, false);
    log(`Chat Response from Groq pushed to database with timestamp: ${groq_msg.timestamp}`, "Cyan", {bright: ["Chat Response"]});
    addMsgtoChatData(user_id, groq_msg);
    log("Finished", "Green");
    return res.status(200).end();
};
