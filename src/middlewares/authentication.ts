import { createChatData, getChatData } from "../db/Chat";
import { Request, Response, NextFunction } from "express";
import { merge } from "lodash";
import { Logger } from "../debug/log";

const log = Logger("AuthenticationMiddleware");

const AuthenticationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user_id = req.query["user_id"]?.toString();

    if (!user_id) {
        const msg = "Please Provide user_id as url query";
        console.log();
        log(msg, "Red");
        return res.status(403).send(msg).end();
    }

    const existingChat = await getChatData(user_id);
    if (!existingChat) {
        const msg = `Existing chat not found with user_id: ${user_id}`;
        console.log();
        log(msg, "Red");
        return res.status(401).send(msg).end();
    }

    const { prefix, nickname } = existingChat;
    if (!nickname) {
        const msg = "please re-register again. nickname is missing";
        console.log();
        log(msg, "Red");
        return res.status(400).json({
            msg,
        });
    }

    merge(req.body, { user_id, prefix, nickname });

    return next();
};

export default AuthenticationMiddleware;
