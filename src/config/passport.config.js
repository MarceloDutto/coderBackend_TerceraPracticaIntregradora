import passport from "passport";
import jwt from 'passport-jwt';
import config from "./index.js";
import { cookieExtractor } from "../utils/cookieExtractor.utils.js";

const { jwt_secret } = config.jwt;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy(
        {jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwt_secret,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch(error) {
            return done(error);
        }
    }
    ));
};

export default initializePassport;