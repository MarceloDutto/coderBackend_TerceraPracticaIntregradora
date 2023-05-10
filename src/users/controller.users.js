import { Router } from "express";
import { registerUser } from "./service.users.js";

const router = Router();

router.post('/', async (req, res) => {
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

export default router;