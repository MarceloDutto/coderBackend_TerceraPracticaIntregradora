import { Router } from "express";
import { resetPassword, userAuthentication, userForgotPassword } from "./service.auth.js";

const router = Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await userAuthentication(email, password);
        if(response.status === 'failed') return res.status(400).json({status: response.status, message: response.message});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: 'No se pudo autenticar el usuario'});
    }
});

router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    
    try {
        const response = await userForgotPassword(email);
        res.json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: error.message});
    }
});

router.post('/resetPassword', async (req, res) => {
    const { password, token } = req.body;

    try {
        const response = await resetPassword(token, password);
        res.json({status: response.status, message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', message: error.message});
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
})

export default router;