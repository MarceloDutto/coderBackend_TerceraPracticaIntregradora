import ChatManager from "../dao/mongoDB/persistence/chatManager.mongoDB.js";

const chm = new ChatManager();

export const getMessages = async () => {
    try {
        const messages = await chm.getMessages();
        if(messages === []) return {status: 'failed', message: 'No hay mensajes en la base de datos', payload: messages};
        return {message: 'Mensajes en la base de datos', payload: messages};
    } catch(error) {
        throw error;
    }
};

export const createMessage = async (message) => {
    try {
        const data = await chm.createMessage(message);
        return {message: 'Mensaje creado', payload: data};
    } catch(error) {
        throw error;
    }
};

export const deleteMessages = async () => {
    try {
        await chm.deleteMessages();
        return {message: 'Todos los mensajes eliminados de la base de datos'};
    } catch (error) {
        throw error;
    }
};