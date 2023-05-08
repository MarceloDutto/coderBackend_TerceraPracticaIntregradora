import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    app: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    },
    db: {
        userDB: process.env.USER_DB,
        passDB: process.env.PASS_DB,
        hostDB: process.env.HOST_DB
    },
    github: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    jwt: {
        jwt_secret: process.env.JWT_SECRET
    },
    admin: {
        admin_email: process.env.ADMIN_EMAIL,
        admin_password: process.env.ADMIN_PASSWORD
    }
};

export default config;