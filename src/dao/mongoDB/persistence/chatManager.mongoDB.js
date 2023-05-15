import Message from "../models/chat.models.js";

class ChatManager {

    getMessages = async () => {
        try {
            const data = await Message.find();
            return data;
        } catch(error) {
            throw error;
        }
    };

    createMessage = async (message) => {
        try {
            const data = await Message.create(message);
            return data;
        } catch(error) {
            throw error;
        }
    };

    deleteMessages = async () => {
        try {
            await Message.deleteMany();
        } catch(error) {
            throw error;
        }
    };
};

export default ChatManager;