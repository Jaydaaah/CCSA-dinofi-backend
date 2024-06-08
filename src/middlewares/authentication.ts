import { getChatData } from "../db/Chat";
import { Request, Response, NextFunction } from "express";
import { merge } from "lodash";
import { Logger } from "../debug/log";

const log = Logger("AuthenticationMiddleware");

const AuthenticationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const chat_id = req.query["chat_id"]?.toString();

    if (!chat_id) {
        const msg = "Please Provide chat_id as url query";
        console.log();
        log(msg, "Red");
        return res.status(403).send(msg).end();
    }

    const existingChat = await getChatData(chat_id);
    if (!existingChat) {
        const msg = `Existing chat not found with chat_id: ${chat_id}`;
        console.log();
        log(msg, "Red");
        return res.status(401).send(msg).end();
    }

    const { nickname } = existingChat;
    if (!nickname) {
        const msg = "please re-register again. nickname is missing";
        console.log();
        log(msg, "Red");
        return res.status(400).json({
            msg,
        });
    }

    merge(req.body, { chat_id, nickname });

    return next();
};

export default AuthenticationMiddleware;
