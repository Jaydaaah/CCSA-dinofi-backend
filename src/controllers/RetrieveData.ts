import { Chat, Message, getChatData } from "../db/Chat";
import { Request, Response } from "express";

const RetrieveData = async (req: Request, res: Response) => {
    const user_id: string = req.body["user_id"];

    const chatdata = await getChatData(user_id);

    if (!chatdata) {
        return res.sendStatus(503);
    }

    return res.status(200).json(chatdata.toObject<Chat>()).end();
};

export default RetrieveData;
