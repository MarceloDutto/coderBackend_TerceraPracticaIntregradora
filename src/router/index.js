import productsController from "../products/controller.products.js";
import cartsController from "../carts/controller.carts.js";
import usersController from "../users/controller.users.js";
import authController from "../auth/controller.auth.js";
import mockingController from "../faker/controller.faker.js";
import loggerController from "../winston/controller.winston.js";
import viewsController from "../views/controller.views.js";

const router = app => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/users', usersController);
    app.use('/api/auth', authController);
    app.use('/mockingproducts', mockingController);
    app.use('/loggerTest', loggerController);
    app.use('/', viewsController);
};

export default router;