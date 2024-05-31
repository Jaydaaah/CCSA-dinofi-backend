import { createChatData } from "../db/Chat";
import { Request, Response } from "express";
import { Logger, PrintFetch } from "../debug/log";

const log = Logger("Register");

export default async function Register(req: Request, res: Response) {
    PrintFetch("POST");

    const nickname: string | undefined = req.body["nickname"];
    const prefix: string | undefined = req.body["prefix"];

    if (!nickname) {
        const msg = "Please provide the nickname";
        log(msg, "Red");
        return res.status(406).json({
            msg
        });
    }

    log(`Creating New ChatData using name: ${prefix} ${nickname}`);
    const newchat = await createChatData(nickname, prefix);

    if (newchat) {
        log(`New Registered user: ${prefix} ${nickname}`, "Green");
        return res
            .status(201)
            .json({
                user_id: newchat._id.toString(),
            })
            .end();
    } else {
        const msg = "Something went wrong";
        log(msg, "Red");
        return res.status(503).send(msg).end();
    }
};
