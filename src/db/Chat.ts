import { model, Schema, Types } from "mongoose";

export interface Message {
    text: string;
    isright: boolean;
    timestamp: Number;
}

const emptyMessages: Message[] = [];

const toMessage = (text: string, isright: boolean) => {
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

const createChatData = async (nickname: string, prefix: string = "") => {
    return new ChatModel({
        prefix,
        nickname,
        data: [],
    }).save();
};

const getChatData = (_id: string) => ChatModel.findById(_id);

const deleteChatData = (_id: string) => ChatModel.findByIdAndDelete(_id);

const addMsgtoChatData = async (_id: string, msg: Message) => {
    const chat = await getChatData(_id);
    if (chat) {
        chat.data.push(msg);
        chat.save();
    } else {
        console.error(`ID doesn't exists: ${_id}`);
    }
};

export {
    createChatData,
    addMsgtoChatData,
    deleteChatData,
    emptyMessages,
    getChatData,
    toMessage,
};
