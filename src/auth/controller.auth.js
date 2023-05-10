import { Router } from "express";
import { userAuthentication } from "./service.auth.js";

const router = Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        const response = await userAuthentication(email, password);
        if(response.status === 'failed') return res.status(400).json({status: response.status, message: response.message});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: 'No se pudo autenticar el usuario'});
    }
});

export default router;