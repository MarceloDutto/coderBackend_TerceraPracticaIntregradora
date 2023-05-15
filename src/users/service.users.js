import UserManager from "../dao/mongoDB/persistence/usersManager.mongoDB.js";
import { addCart } from "../carts/service.carts.js";
import { createHash } from "../utils/bcrypt.utils.js";
import UserDTO from "../DTOs/users.dto.js";

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
            cart: newUserCart.payload._id
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
        return {status: 'success', payload: newUserInfo, message: 'Usario actualizado con éxito'};
    } catch(error) {
        throw error;
    }
};