import jwt from "jsonwebtoken";
import config from "../config/index.js";

const jwt_secret = config.jwt.jwt_secret;

export const generateToker = user => {
    const token = jwt.sign({ user }, jwt_secret, {expiresIn: '15m'});
    return token
};