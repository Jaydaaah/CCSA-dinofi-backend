import { deleteChatData, getChatData } from "../db/Chat";
import { Request, Response } from "express";

const DeleteData = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    await deleteChatData(user_id);

    return res.sendStatus(200).end();
};

export default DeleteData;
