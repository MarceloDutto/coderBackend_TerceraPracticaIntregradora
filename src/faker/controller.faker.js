import { Router } from "express";
import { generateProduct } from "../utils/faker.utils.js";

const router = Router();

router.get('/', async (req, res) => {
    let mockedProducts = [];
    for(let i=0; i<100; i++) {
        mockedProducts.push(generateProduct());
    };

    res.json({status: 'success', message: 'Productos generados', payload: mockedProducts});
});

export default router;