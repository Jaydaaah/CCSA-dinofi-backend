import { createChatData } from "../db/Chat";
import { Request, Response } from "express";

const Register = async (req: Request, res: Response) => {
    const nickname: string | undefined = req.body["nickname"];
    const prefix: string | undefined = req.body["prefix"];

    console.log(req.body);

    if (!nickname) {
        return res.status(406).json({
            message: "Please provide the nickname",
        });
    }

    const newchat = await createChatData(nickname, prefix);

    console.log(`New Registered user: ${prefix} ${nickname}`);
    return res
        .status(201)
        .json({
            user_id: newchat._id.toString(),
        })
        .end();
};

export default Register;
