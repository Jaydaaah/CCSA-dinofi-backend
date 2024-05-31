import { Chat, Message, getChatData } from "../db/Chat";
import { Request, Response } from "express";
import { Logger, PrintFetch } from "../debug/log";

const log = Logger("RetrieveData");

export default async function RetrieveData(req: Request, res: Response) {
    PrintFetch("GET");
    const user_id: string = req.body["user_id"];

    if (!user_id) {
        const msg = "Please provide user_id";
        log(msg, "Red");
        return res.status(400).send(msg);
    }

    log(`Retrieving Chat Data with user_id: ${user_id}`);
    const chatdata = await getChatData(user_id);

    if (!chatdata) {
        const msg = `Chat not found, user_id: ${user_id}`;
        log(msg, "Red")
        return res.status(503).send(msg).end();
    }
    log(`Chat Data send, user_id: ${user_id}`, "Green");
    return res.status(200).json(chatdata.toObject<Chat>()).end();
};
