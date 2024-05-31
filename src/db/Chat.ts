import { isValidObjectId, model, Schema, Types } from "mongoose";

export interface Message {
    text: string;
    isright: boolean;
    timestamp: Number;
}

const emptyMessages: Message[] = [];

export const toMessage = (text: string, isright: boolean) => {
    const new_msg: Message = {
        text,
        isright,
        timestamp: Date.now(),
    };
    return new_msg;
};

export interface Chat {
    nickname: string;
    prefix: string;
    data: Types.DocumentArray<Message>;
}

const ChatSchema = new Schema<Chat>({
    nickname: { type: String, required: true },
    prefix: { type: String, required: false },
    data: [
        {
            text: { type: String, required: true },
            isright: { type: Boolean, required: true },
            timestamp: { type: Number, required: true },
        },
    ],
});

const ChatModel = model("Chat", ChatSchema);

export async function createChatData(nickname: string, prefix: string = "") {
    return await ChatModel.create({
        prefix,
        nickname,
        data: [],
    });
}

export async function getChatData(_id: string) {
    if (isValidObjectId(_id)) {
        return await ChatModel.findById(_id);
    } else {
        return null;
    }
}

export async function deleteChatData(_id: string) {
    if (isValidObjectId(_id)) {
        return await ChatModel.findByIdAndDelete(_id);
    } else {
        return null;
    }
}

export async function addMsgtoChatData(_id: string, msg: Message) {
    const chat = await getChatData(_id);
    if (chat) {
        chat.data.push(msg);
        await chat.save();
    } else {
        console.error(`ID doesn't exists: ${_id}`);
    }
}
