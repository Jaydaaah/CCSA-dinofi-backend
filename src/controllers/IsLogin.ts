import { getChatData } from "../db/Chat";
import { Request, Response } from "express";

const IsLogin = async (req: Request, res: Response) => {
    const user_id = req.query["user_id"].toString();
    console.log(`checking log in: ${user_id}`);
    let isloggedin = false;

    if (user_id) {
        const existingChat = await getChatData(user_id);
        if (existingChat) {
            isloggedin = true;
        }
    }

    return res.status(200).json({
        isloggedin,
    });
};

export default IsLogin;
