import { isValidObjectId, model, Schema, Types } from "mongoose";

interface Message {
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
    data: Types.DocumentArray<Message>;
}

const ChatSchema = new Schema<Chat>({
    nickname: { type: String, required: true },
    data: [
        {
            text: { type: String, required: true },
            isright: { type: Boolean, required: true },
            timestamp: { type: Number, required: true },
        },
    ],
});

const ChatModel = model("Chat", ChatSchema);

export async function createChatData(nickname: string) {
    const new_chat = await ChatModel.create({
        nickname,
        data: [],
    });
    return new_chat;
}

export async function getChatData(_id: any) {
    if (isValidObjectId(_id)) {
        return await ChatModel.findById(_id);
    } else {
        return null;
    }
}

export async function deleteChatData(_id: any) {
    if (isValidObjectId(_id)) {
        return await ChatModel.findByIdAndDelete(_id);
    } else {
        return null;
    }
}

export async function addMsgtoChatData(_id: any, msg: Message) {
    if (isValidObjectId(_id)) {
        const chat = await getChatData(_id);
        if (chat) {
            chat.data.push(msg);
            await chat.save();
            return true;
        }
    }
    console.error(`ID doesn't exists: ${_id}`);
    return false;
}

export async function retrieveLastUserPrompts(_id: any, count: number = 3) {
    if (isValidObjectId(_id)) {
        const chat = await ChatModel.findById(_id).select(`data`);
        if (chat && chat.data.length > 0) {
            const filtered_data = chat.data;
            return filtered_data.slice(Math.max(filtered_data.length - count, 0));
        }
    }
    return [];
}
