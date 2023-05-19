import express from 'express';
import passport from 'passport';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import swaggerUiExpress from 'swagger-ui-express'
import __dirname from './utils/dirname.utils.js';
import config from './config/index.js';
import initializePassport from './config/passport.config.js';
import addLogger from './middlewares/logger.middlewares.js';
import router from './router/index.js';
import MongoConnection from '../db/mongo.db.js';
import swaggerSpecs from './config/swagger.config.js';


const app = express();
const port =  config.app.port;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(addLogger);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

initializePassport();
app.use(passport.initialize());

MongoConnection.getInstance();

router(app);

export { app, port };