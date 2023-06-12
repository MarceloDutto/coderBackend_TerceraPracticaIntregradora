import UserManager from "../dao/mongoDB/persistence/usersManager.mongoDB.js";
import { addCart } from "../carts/service.carts.js";
import { createHash } from "../utils/bcrypt.utils.js";
import UserDTO from "../DTOs/users.dto.js";
import fs from 'fs'
import __dirname from "../utils/dirname.utils.js";

const um = new UserManager();

export const registerUser = async (newUserInfo) => {
    const { first_name, last_name, age, email, password } = newUserInfo;

    try {
        const user = await findUserByEmail(email);
        if(Object.keys(user).length !== 0) return {status: 'failed', message: 'Ya existe un usuario regitrado con el mismo email'};
        
        
        const newUserCart = await addCart();

        const newUserData = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            cart: newUserCart.payload._id,
            last_connection: new Date
        };
                
        const response = await um.register(newUserData);
        const newUser = new UserDTO(response);
        
        return {status: 'success', message: 'Usuario registrado exitosamente', payload: newUser};
    } catch(error) {
        throw error;
    }
};

export const findUserByEmail = async (emailRef) => {
    try {
        const user = await um.findByQuery({email: emailRef});
        return user;
    } catch(error) {
        throw error;
    }
};

export const findUserById = async (idRef) => {
    try {
        const user = await um.findById(idRef);
        return user;
    } catch(error) {
        throw error;
    }
};

export const findByQuery = async (query) => {
    try {
        const user = await um.findByQuery(query);
        return user;
    } catch(error) {
        throw error;
    }
};

export const updateUser = async (idRef, update) => {
    try {
        const response = await um.update(idRef, update);
        const newUserInfo = new UserDTO(response);
        return {status: 'success', payload: newUserInfo, message: 'Usuario actualizado con éxito'};
    } catch(error) {
        throw error;
    }
};

export const uploadUserDocumentation = async (user, idFile, addressFile, accountFile) => {
    try {
        if(idFile) {
            const docs = user.documents;
            for(let i = 0; i < docs.length; i++) {
                let obj = docs[i];

                if(obj.name === 'identification') {
                    user.documents.splice(i, 1);
                    fs.unlinkSync(obj.reference);
                }
            };

            const filePath = idFile.filename
            const relativePath = __dirname + `/documents/${filePath}`;
            const doc = {
                name: 'identification',
                reference: relativePath
            }
            user.documents.push(doc)
        };

        if(addressFile) {
            const docs = user.documents;
            for(let i = 0; i < docs.length; i++) {
                let obj = docs[i];

                if(obj.name === 'proofOfAddress') {
                    user.documents.splice(i, 1);
                    fs.unlinkSync(obj.reference);
                }
            };

            const filePath = addressFile.filename
            const relativePath = __dirname + `/documents/${filePath}`;
            const doc = {
                name: 'proofOfAddress',
                reference: relativePath
            }
            user.documents.push(doc)
        };

        if(accountFile) {
            const docs = user.documents;
            for(let i = 0; i < docs.length; i++) {
                let obj = docs[i];

                if(obj.name === 'bankStatement') {
                    user.documents.splice(i, 1);
                    fs.unlinkSync(obj.reference);
                }
            };

            const filePath = accountFile.filename
            const relativePath = __dirname + `/documents/${filePath}`;
            const doc = {
                name: 'bankStatement',
                reference: relativePath
            }
            user.documents.push(doc)
        };

        await updateUser(user.id, user);
        return {message: 'Documentación guardada con éxito'}
    } catch(error) {
        throw error;
    }
};

export const deleteUser = async (idRef) => {
    try {
        const user = await findUserById(idRef);
        if(Object.keys(user).length === 0) return {status: 'error', code: 404, message: 'El usuario no existe en la base de datos'};
        
        const response = await um.delete(idRef);
        return {status: 'success', message: response};
    } catch(error) {
        throw error;
    }
};