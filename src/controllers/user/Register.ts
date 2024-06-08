import { Request, Response } from "express";
import { Logger, PrintFetch } from "../../debug/log";
import { NewUser, filterUser, getbyNickname } from "../../db/User";
import { queue } from "async";

const log = Logger("Register");

export default async function Register(req: Request, res: Response) {
    PrintFetch("GET");

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

    log(`Retrieving existing user with nickname: ${nickname}`, "White", {
        underscore: [nickname],
    });
    const existingUser = await getbyNickname(nickname);

    if (existingUser) {
        log("existing nickname found", "Green");
        return res.status(200).json(filterUser(existingUser)).end();
    } else {
        log(`Creating New User using name: ${nickname}`);
        const newuser = await NewUser(nickname);

        if (newuser) {
            log(`New Registered user: ${nickname}`, "Green");
            return res
                .status(201)
                .json(filterUser(newuser))
                .end();
        } else {
            const msg = "Something went wrong";
            log(msg, "Red");
            return res.status(503).send(msg).end();
        }
    }
}
