import axios from "axios";
import { Message, addMsgtoChatData, toMessage } from "../db/Chat";

const AI_PORT = 8000;
const AI_ID = "99991856-0247-11ef-b6e6-902b340f0333";

interface BOTRESPONSE {
    botname: string;
    response: string;
}

const SendtoAI = async (_id: string, prompt: string) => {
    const res = await axios.post<BOTRESPONSE>(
        `http://localhost:${AI_PORT}/default-prompt`,
        {
            prompt: prompt,
        }
    );
    const { botname, response } = res.data;
    addMsgtoChatData(_id, toMessage(response, false));
    return botname;
};

export { SendtoAI };
