import { SendtoAI } from "../lib/AI-api";
import { Message, addMsgtoChatData, toMessage } from "../db/Chat";
import { Request, Response } from "express";
import { GrogStreamPrompt } from "../lib/Groq-api";

const ClientPrompt = async (req: Request, res: Response) => {
    const user_id: string = req.body["user_id"];
    const prompt: string | undefined = req.body["prompt"];
    const prefix: string = req.body["prefix"] ?? "";
    const nickname: string = req.body["nickname"] ?? "";
    const name = `${prefix} ${nickname}`;

    let grogStream = "";

    if (!prompt) {
        return res.sendStatus(403);
    }

    const client_msg = toMessage(prompt, true);
    const { text, isright, timestamp } = client_msg;

    await addMsgtoChatData(user_id, client_msg);
    // await SendtoAI(user_id, prompt);

    for await (var chunk of GrogStreamPrompt(prompt)) {
        res.write(chunk);
        grogStream += chunk;
    }
    addMsgtoChatData(user_id, toMessage(grogStream, false));

    // .json({
    //     text,
    //     isright,
    //     timestamp,
    // })
    return res.status(200).end();
};

export default ClientPrompt;
