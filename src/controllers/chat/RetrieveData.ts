import { Chat, getChatData } from "../../db/Chat";
import { Request, Response } from "express";
import { Logger, PrintFetch } from "../../debug/log";

const log = Logger("RetrieveData");

export default async function RetrieveData(req: Request, res: Response) {
    PrintFetch("GET");
    const chat_id: string = req.body["chat_id"];

    if (!chat_id) {
        const msg = "Please provide chat_id";
        log(msg, "Red");
        return res.status(400).send(msg);
    }

    log(`Retrieving Chat Data with chat_id: ${chat_id}`);
    const chatdata = await getChatData(chat_id);

    if (!chatdata) {
        const msg = `Chat not found, user_id: ${chat_id}`;
        log(msg, "Red")
        return res.status(503).send(msg).end();
    }
    log(`Chat Data send, user_id: ${chat_id}`, "Green");
    return res.status(200).json(chatdata.toObject<Chat>()).end();
};
