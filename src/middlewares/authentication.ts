import { createChatData, getChatData } from "../db/Chat";
import { Request, Response, NextFunction } from "express";
import { merge } from "lodash";

const AuthenticationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user_id = req.query["user_id"]?.toString();

    if (!user_id) {
        return res.sendStatus(403);
    }

    const existingChat = await getChatData(user_id);
    if (!existingChat) {
        return res.sendStatus(401);
    }

    const { prefix, nickname } = existingChat;
    if (!nickname) {
        return res.status(400).json({
            message: "please re-register again. nickname is missing",
        });
    }
    merge(req.body, { user_id, prefix, nickname });

    return next();
};

export default AuthenticationMiddleware;
