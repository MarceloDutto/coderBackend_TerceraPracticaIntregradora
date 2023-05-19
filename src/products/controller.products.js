import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, deleteAllProducts } from "./service.products.js";
import { uploader } from "../utils/multer.utils.js";
import handlePolicies from "../middlewares/handlePolicies.middlewares.js";

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const query = req.query.query || null;
    const sort = req.query.sort || null;

    try {
        const response = await getProducts(limit, page, query, sort);
        res.json({status: response.status? response.status : 'success', message: response.message, payload: response.payload? response.payload : {}});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const response = await getProductById(pid)
        res.json({status: response.status? response.status : 'success', message: response.message, payload: response.payload});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.post('/', uploader.single('file'), handlePolicies(['ADMIN', 'PREMIUM']), async (req, res) => {
    const { name, description, category, code, price, thumbnail=[], stock } = req.body;
    if(!name || !description || !category || !code || !price || !stock) return res.status(400).json({status: 'error', message: 'Debes completar los campos requeridos'});
    const user = req.user;

    const imgPath = req.file?.filename;
    const relativePath = `/img/products/${imgPath}`;
    thumbnail.push(relativePath);

    let owner = 'admin';
    if(user.role === 'premium') {
        owner = user.email;
    };
    
    const productInfo = {
        name,
        description,
        category,
        code,
        price,
        thumbnail,
        stock,
        owner
    };

    try {
        const response = await addProduct(productInfo);
        res.status(201).json({status: response.status? response.status : 'success', message: response.message, payload: response.payload? response.payload : {}});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.patch('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), async (req, res) => {
    const { pid } = req.params;
    const { name, description, category, code, price, thumbnail, stock } = req.body;
    const user = req.user;
    
    if(user.role !== 'admin') {
        const product = await getProductById(pid);
        if(product.payload.owner !== user.email) return res.status(403).json({status: 'error', message: 'No está autorizado a modificar este producto'}); 
    };

    const updates = {
        name,
        description,
        category,
        code,
        price,
        thumbnail, 
        stock
    }

    try {
        const response = await updateProduct(pid, updates);
        res.json({status: response.status? response.status : 'success', message: response.message, payload: response.payload? response.payload : {}});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.delete('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), async (req, res) => {
    const { pid } = req.params;
    const user = req.user;

    if(user.role !== 'admin') {
        const product = await getProductById(pid);
        if(product.payload.owner !== user.email) return res.json({status: 'error', message: 'No está autorizado a eliminar este producto'}); 
    }

    try {
        const response = await deleteProduct(pid);
        res.json({message: response});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({message: 'Error al eliminar el producto'});
    }
});

router.delete('/', handlePolicies('ADMIN'), async (req, res) => {
    try {
        const response = await deleteAllProducts();
        res.json({message: response});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({message: 'Error al eliminar los productos'})
    }
});

export default router;