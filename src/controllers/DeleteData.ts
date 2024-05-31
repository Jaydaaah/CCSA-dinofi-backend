import { deleteChatData } from "../db/Chat";
import { Request, Response } from "express";
import { Logger, PrintFetch } from "../debug/log";

const log = Logger("DeleteData");

export default async function DeleteData(req: Request, res: Response) {
    const log_id = PrintFetch("DELETE");

    const { user_id } = req.body;

    if (user_id) {
        log(`Deleting user id: ${user_id}`, "White", {underscore: [user_id]});
        const user = await deleteChatData(user_id);
        if (user) {
            const msg = "User Chat Data Deleted"
            log(msg, 'Yellow');
            return res.status(202).send(msg).end();
        } else {
            const msg = "User Chat Data not found, but okay";
            log(msg, "Yellow");
            return res.status(204).send(msg).end();
        }
    } else {
        const msg = "No user_id provided. Please provide one";
        log(msg, "Red");
        return res.status(400).send(msg).end();
    }
};
