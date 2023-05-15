import { Router } from "express";
import { registerUser, findUserById, updateUser } from "./service.users.js";
import handlePolicies from "../middlewares/handlePolicies.middlewares.js";

const router = Router();

router.post('/', handlePolicies('PUBLIC'), async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    if(!first_name || !last_name || !age || !email || !password) return res.status(400).json({status: 'error', message: 'Debes completar los campos requeridos'});
    
    const newUserInfo = {
        first_name,
        last_name,
        age,
        email,
        password
    };
    try {
        const response = await registerUser(newUserInfo);
        if(response.status === 'failed') return res.status(400).json({status: response.status, message: response.message, payload: {}});
        res.status(201).json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        req.logger.error(error);
        if(error.code === 11000) return res.status(400).json({status: 'error', error: 'Ya existe un usuario con ese correo electrónico'});
        return res.status(500).json({status: 'error', error: error.message });
    }
});

router.get('/premium/:uid', handlePolicies('USER', 'PREMIUM'), async (req, res) => {
    const { uid } = req.params;

    if(!uid) return res.status(400).json({status: 'error', message: 'El id no es válido'});

    try {
        const user = await findUserById(uid);
        if(!user) return res.status(400).json({status: 'error', message: 'No existe un usuario registrado con ese id'});

        switch (user.role) {
            case 'user':
                user.role = 'premium'
                break;
            case 'premium':
                user.role = 'user'
                break;
        }

        const response = await updateUser(uid, user);
        return res.json(response);
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

export default router;