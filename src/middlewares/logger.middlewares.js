import logger from "../logger/factory.logger.js";

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`);

    next()
};

export default addLogger;