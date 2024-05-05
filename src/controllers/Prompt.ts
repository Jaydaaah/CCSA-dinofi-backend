import { SendtoAI } from "../lib/AI-api";
import { Message, addMsgtoChatData, toMessage } from "../db/Chat";
import { Request, Response } from "express";

const ClientPrompt = async (req: Request, res: Response) => {
    const user_id: string = req.body["user_id"];
    const prompt: string | undefined = req.body["prompt"];

    if (!prompt) {
        return res.sendStatus(403);
    }

    const client_msg = toMessage(prompt, true);
    const { text, isright, timestamp } = client_msg;

    await addMsgtoChatData(user_id, client_msg);
    await SendtoAI(user_id, prompt);

    return res
        .status(200)
        .json({
            text,
            isright,
            timestamp,
        })
        .end();
};

export default ClientPrompt;
