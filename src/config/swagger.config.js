import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils/dirname.utils.js";

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de e-commerce coderBackend',
            description: 'Información sobre los recursos relacionados a productos y carritos de la aplicación e-commerce desarrollado en la clase de Programación Backend de Coderhouse.'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;