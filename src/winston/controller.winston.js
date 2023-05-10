import { Router } from "express";

const router = Router();

router.get('/all', (req, res) => {
    req.logger.debug('Mensaje de tipo debug de logger');
    req.logger.http('Mensaje de tipo http de logger');
    req.logger.info('Mensaje de tipo info de logger');
    req.logger.warning('Mensaje de tipo warning de logger');
    req.logger.error('Mensaje de tipo error de logger');
    req.logger.fatal('Mensaje de tipo fatal de logger');
    res.json({message: 'Prueba de logger: debug, http, info, warning, error, fatal'});
});

router.get('/debug', (req, res) => {
    req.logger.debug('Mensaje de tipo debug de logger');
    res.json({message: 'Prueba de logger: debug'});
});

router.get('/http', (req, res) => {
    req.logger.http('Mensaje de tipo http de logger');
    res.json({message: 'Prueba de logger: http'});
});

router.get('/info', (req, res) => {
    req.logger.info('Mensaje de tipo info de logger');
    res.json({message: 'Prueba de logger: info'});
});

router.get('/warning', (req, res) => {
    req.logger.warning('Mensaje de tipo warning de logger');
    res.json({message: 'Prueba de logger: warning'});
});

router.get('/error', (req, res) => {
    req.logger.error('Mensaje de tipo error de logger');
    res.json({message: 'Prueba de logger: error'});
});

router.get('/fatal', (req, res) => {
    req.logger.fatal('Mensaje de tipo fatal de logger');
    res.json({message: 'Prueba de logger: fatal'});
});

export default router;