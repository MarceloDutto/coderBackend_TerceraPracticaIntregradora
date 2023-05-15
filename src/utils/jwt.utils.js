import jwt from "jsonwebtoken";
import config from "../config/index.js";

const jwt_secret = config.jwt.jwt_secret;

export const generateToken = user => {
    const token = jwt.sign({ user }, jwt_secret, {expiresIn: '15m'});
    return token
};

export const generateRecoveryToken = user => {
    const token = jwt.sign({userId: user.id}, jwt_secret, {expiresIn: '1h'});
    user.recoveryToken = token;
    user.recoveryTokenExpiration = Date.now() + 3600000;
    return user;
};