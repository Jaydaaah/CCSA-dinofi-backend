import { Request, Response } from "express";
import { Logger, PrintFetch } from "../../debug/log";
import { deleteUser, getbyNickname } from "../../db/User";
import { deleteChatData } from "../../db/Chat";

const log = Logger("Register");

export default async function DeleteUserData(req: Request, res: Response) {
    PrintFetch("DELETE");

    const nickname = req.query["nickname"]?.toString();

    if (!nickname) {
        const msg =
            "Please provide the nickname in the url query to be deleted";
        log(msg, "Yellow");
        return res
            .status(406)
            .json({
                msg,
            })
            .end();
    }

    log(`Retrieving existing user with nickname: ${nickname}`, "White", {
        underscore: [nickname],
    });
    const existingUser = await getbyNickname(nickname);

    if (existingUser) {
        log("existing nickname to be deleted found", "Green");

        for (const chat_id of existingUser.chat_ids) {
            deleteChatData(chat_id);
        }
        log(`All chat data from nickname: ${nickname} removed`, "Yellow");

        deleteUser(existingUser._id);

        const msg = `User Deleted: ${nickname}`;
        log(msg, "Yellow");
        return res.status(202).send(msg).end();
    } else {
        
        const msg = `User with nickname: ${nickname} not found, but okay`;
        log(msg, "Yellow");
        return res.status(204).send(msg).end();
    }
}
