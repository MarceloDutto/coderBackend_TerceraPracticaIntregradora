import nodemailer from 'nodemailer';
import config from '../config/index.js';

export const transport = nodemailer.createTransport({
    service: config.nodemailer.gmail_service,
    port: config.nodemailer.gmail_port,
    auth: {
        user: config.nodemailer.gmail_user,
        pass: config.nodemailer.gmail_pass
    }
});