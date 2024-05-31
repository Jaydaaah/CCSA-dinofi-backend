import { getChatData } from "../db/Chat";
import { Request, Response } from "express";
import { Logger, PrintFetch } from "../debug/log";

const log = Logger("IsLogin");

export default async function IsLogin(req: Request, res: Response) {
    PrintFetch("GET");
    const user_id = req.query["user_id"]?.toString();

    if (user_id) {
        log(`Retrieving existing chat with user_id: ${user_id}`, "White", {
            underscore: [user_id],
        });
        const existingChat = await getChatData(user_id);

        if (existingChat) {
            log("existing chat found", "Green");
            return res
                .status(200)
                .json({
                    isloggedin: true,
                })
                .end();
        } else {
            log("No chat found", "Red");
            return res
                .status(200)
                .json({
                    isloggedin: false,
                })
                .end();
        }
    } else {
        const msg = "Please provide a user_id";
        log(msg, "Red");
        return res.status(400).send(msg).end();
    }
}
