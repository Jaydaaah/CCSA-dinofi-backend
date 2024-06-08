import { deleteChatData } from "../../db/Chat";
import { Request, Response } from "express";
import { Logger, PrintFetch } from "../../debug/log";
import { getbyNickname, removeChatId } from "../../db/User";

const log = Logger("DeleteData");

export default async function DeleteData(req: Request, res: Response) {
    PrintFetch("DELETE");

    const { chat_id } = req.body;

    if (chat_id) {
        log(`Deleting chat id: ${chat_id}`, "White", { underscore: [chat_id] });

        const chat_data = await deleteChatData(chat_id);
        if (chat_data) {
            const msg = "User Chat Data Deleted";
            log(msg, "Yellow");

            log("Updating User Chat IDs");
            const remove = await removeChatId(
                chat_data.nickname,
                chat_data._id
            );
            if (remove) {
                log(
                    `Chat Data removed. chat_id: ${chat_data._id}, nickname: ${chat_data.nickname}`,
                    "Yellow"
                );
            }

            return res.status(202).send(msg).end();
        } else {
            const msg = "User Chat Data not found, but okay";
            log(msg, "Yellow");
            return res.status(204).send(msg).end();
        }
    } else {
        const msg = "No chat_id provided. Please provide one";
        log(msg, "Red");
        return res.status(400).send(msg).end();
    }
}
