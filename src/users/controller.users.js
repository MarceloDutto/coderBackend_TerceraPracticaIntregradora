import { Router } from "express";
import multer from "multer";
import { registerUser, findUserById, updateUser, uploadUserDocumentation, deleteUser } from "./service.users.js";
import handlePolicies from "../middlewares/handlePolicies.middlewares.js";
import { docStorage } from "../utils/multer.utils.js";

const router = Router();
const uploader = multer({storage: docStorage}).fields([
    {name: 'identity', maxCount: 1},
    {name: 'address', maxCount: 1},
    {name: 'account', maxCount: 1},
]);

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
        res.status(500).json({status: 'error', error: error.message });
    }
});

router.post('/:uid/documents', handlePolicies(['USER']), uploader, async (req, res) => {
    const { uid } = req.params;
    if(!uid) return res.status(400).json({status: 'error', message: 'El id no es válido'});

    const idFile = req.files['identity']? req.files['identity'][0] : null;
    const addressFile = req.files['address']? req.files['address'][0] : null;
    const accountFile = req.files['account']? req.files['account'][0] : null;

    if(!idFile && !addressFile && !accountFile) return res.status(400).json({status: 'error', message: 'No se han seleccionado archivos para ser subidos'});

    try {
        const user = await findUserById(uid)
        if(!user) return res.status(400).json({status: 'error', message: 'No existe un usuario registrado con ese id'});

        const response = await uploadUserDocumentation(user, idFile, addressFile, accountFile);
        res.json({status: 'success', message: response.message});
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.get('/premium/:uid', handlePolicies(['USER', 'PREMIUM']), async (req, res) => {
    const { uid } = req.params;

    if(!uid) return res.status(400).json({status: 'error', message: 'El id no es válido'});

    try {
        const user = await findUserById(uid);
        if(!user) return res.status(400).json({status: 'error', message: 'No existe un usuario registrado con ese id'});

        switch (user.role) {
            case 'user':
                const docs = [];
                user.documents.forEach(obj => {
                    docs.push(obj.name);
                });

                if(docs.includes('identification' && 'proofOfAddress' && 'bankStatement')) {
                    user.role = 'premium';
                } else {
                    return res.status(400).json({status: 'error', message: 'No se ha terminado de procesar la documentación necesaria. Revise los requisitos.'})
                };
                break;
            case 'premium':
                user.role = 'user';
                break;
        }

        const response = await updateUser(uid, user);
        res.json(response);
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.delete('/:uid', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), async (req, res) => {
    const { uid } = req.params;

    try {
        const response = await deleteUser(uid);
        if(response.status === 'error') res.status(404).json({status: response.status, message: response.message});

        res.json(response);
    } catch(error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

export default router;