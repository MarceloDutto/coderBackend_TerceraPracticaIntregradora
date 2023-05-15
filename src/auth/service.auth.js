import { findByQuery, findUserByEmail, updateUser } from "../users/service.users.js";
import { isValidPassword, createHash } from "../utils/bcrypt.utils.js";
import { generateToken, generateRecoveryToken,  } from "../utils/jwt.utils.js";
import { transport } from "../utils/nodemailer.utils.js";
import { generateResetPasswordMail } from "../mails/resetPassword.mail.js";
import config from "../config/index.js";

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
        throw error;
    }
};

export const userForgotPassword = async (email) => {
    try {
        const user = await findUserByEmail(email);
        if(Object.keys(user).length === 0) return {status: 'error', message: 'No hay un usuario registrado en la base de datos con ese correo electrónico'};

        generateRecoveryToken(user);
        await updateUser(user.id, user);

        const resetUrl = `http://localhost:3000/resetPassword?token=${user.recoveryToken}`;

        const mailOptions = {
            from: config.nodemailer.gmail_user,
            to: email,
            subject: 'coderBackend - Recuperación de contraseña',
            html: generateResetPasswordMail(user, resetUrl),
            attachments: []
        }
        const result = await transport.sendMail(mailOptions);
        return {status: 'success', message: 'El correo fue enviado a la dirección especificada', payload: result};
    } catch(error) {
        throw error;
    }
};

export const resetPassword = async (token, password) => {
    try {
        const user =  await findByQuery({recoveryToken: token, recoveryTokenExpiration: { $gt: Date.now() }});
        if(Object.keys(user).length === 0) return {status: 'error', message: 'El token de restablecimiento de contraseña no es válido o ha caducado.'};

        if(isValidPassword(user, password)) {
            return {status: 'error', message: 'Por razones de seguridad, no se puede reutilizar la misma contraseña.'};
        }

        user.password = createHash(password);
        user.recoveryToken = '';
        user.recoveryTokenExpiration = '';
        await updateUser(user.id, user); 

        return {status: 'success', message: 'La contraseña se ha modificado con éxito. Por favor ingrese a su cuenta con la nueva autenticación.'};
    } catch(error) {
        throw error;
    }
};