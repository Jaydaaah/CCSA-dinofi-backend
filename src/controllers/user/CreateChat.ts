import { Request, Response } from "express";
import { Logger, PrintFetch } from "../../debug/log";
import { NewUser, appendChatId, getbyNickname } from "../../db/User";
import { createChatData } from "../../db/Chat";

const log = Logger("CreateChat");

export const defaultChatTitle = "untitled";

export default async function CreateChat(req: Request, res: Response) {
    PrintFetch("POST");

    const nickname = req.query["nickname"]?.toString();

    if (!nickname) {
        const msg = "Please provide the nickname in the url query";
        log(msg, "Red");
        return res
            .status(406)
            .json({
                msg,
            })
            .end();
    }

    log(`Retreiving User ID by nickname: ${nickname}`);
    let existingUser = await getbyNickname(nickname);

    if (!existingUser) {
        log(`Creating New User using name: ${nickname}`);
        existingUser = await NewUser(nickname);
    }

    log("Creating new Chat Data");
    const new_chat = await createChatData(nickname);

    if (new_chat) {
        await appendChatId(existingUser._id.toString(), new_chat._id.toString(), defaultChatTitle);

        const msg = "Chat data created success";
        log(msg, "Green");
        return res.status(201).json({
            chat_id: new_chat._id
        }).end();
    } else {
        const msg = "Something went wrong when create";
        log(msg, "Red");
        return res.status(400).send(msg).end();
    }
}
