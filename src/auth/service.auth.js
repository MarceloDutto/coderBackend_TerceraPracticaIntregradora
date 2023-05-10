import { findUserByEmail } from "../users/service.users.js";
import { isValidPassword } from "../utils/bcrypt.utils.js";
import { generateToken } from "../utils/jwt.utils.js";

export const userAuthentication = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if(!user) return {status: 'failed', message: 'El usuario y la contraseña no coinciden'};
        if(!isValidPassword(user, password)) return {status: 'failed', message: 'El usuario y la contraseña no coinciden'};

        const data = {
            first_name: user.first_name,
            last_name: user.last_name,
            fullname: user.first_name + " " + user.last_name,
            email,
            cart: user.cart,
            role: user.role
        }

        let token = generateToken(data);
        return {status: 'success', message: 'Usuario autenticado', payload: token};
    } catch(error) {
        throw error
    }
};