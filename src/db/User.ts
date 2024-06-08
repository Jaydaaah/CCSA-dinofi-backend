import { isValidObjectId, model, Schema, Types } from "mongoose";

interface ChatId {
    title: string,
    chat_id: string
}

interface User {
    nickname: string;
    chat_ids: ChatId[];
}

const UserSchema = new Schema<User>({
    nickname: { type: String, required: true, unique: true },
    chat_ids: { type: [{
        title: { type: String, required: true},
        chat_id: { type: String, required: true}
    }], required: true },
});

const UserModel = model("chat-users", UserSchema);

export async function NewUser(nickname: string) {
    return await UserModel.create({
        nickname,
    });
}

export async function deleteUser(_id: any) {
    if (isValidObjectId(_id)) {
        return await UserModel.findByIdAndDelete(_id);
    }
    return null;
}

export async function getUserByID(_id: any) {
    if (isValidObjectId(_id)) {
        return await UserModel.findById(_id);
    } else {
        return null;
    }
}

export async function getbyNickname(nickname: string) {
    return await UserModel.findOne({ nickname: nickname });
}

export async function appendChatId(_id: string, chat_id: any, title: string) {
    if (isValidObjectId(chat_id)) {
        const user = await getUserByID(_id);
        const new_chatid: ChatId = {
            title,
            chat_id
        }
        user.chat_ids.push(new_chatid);
        return await user.save();
    } else {
        return null;
    }
}

export async function replaceChatIdTitle(nickname: string, chat_id: any, new_title: string) {
    const title = new_title;
    if (isValidObjectId(chat_id)) {
        const user = await getbyNickname(nickname);
        if (user) {
            user.chat_ids = user.chat_ids.map((ChatId) => {
                if (ChatId.chat_id == chat_id.toString()) {
                    return {
                        chat_id,
                        title
                    }
                } else {
                    return ChatId
                }
            })
            return await user.save();
        }
    }
    return null;
}

export async function getChatIdTitle(nickname: string, chat_id: any) {
    if (isValidObjectId(chat_id)) {
        const user = await getbyNickname(nickname);
        if (user) {
            return user.chat_ids.find((ChatId) => ChatId.chat_id == chat_id).title;
        }
    }
    return "";
}

export async function removeChatId(nickname: string, chat_id: any) {
    if (isValidObjectId(chat_id)) {
        const user = await getbyNickname(nickname);
        return await user.updateOne({
            chat_ids: user.chat_ids.filter((_id) => (_id.chat_id != chat_id))
        })
    }
    return null;
}

function* filterChatId(chat_ids: ChatId[]) {
    for (const {title, chat_id} of chat_ids) {
        const new_chatid: ChatId = {
            title,
            chat_id
        }
        yield new_chatid;
    }
}

export function filterUser({_id, nickname, chat_ids}: User & { _id: Types.ObjectId; } ) {
    const new_response: User & { _id: Types.ObjectId; } = {
        _id,
        nickname,
        chat_ids: Array.from(filterChatId(chat_ids))
    }
    return new_response;
}
