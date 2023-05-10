import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, deleteAllProducts } from "./service.products.js";
import { uploader } from "../utils/multer.utils.js";

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

router.post('/', uploader.single('file'),/*  handlePolicies('ADMIN'), */ async (req, res) => {
    const { name, description, category, code, price, thumbnail=[], stock } = req.body;
    if(!name || !description || !category || !code || !price || !stock) return res.status(400).json({status: 'error', message: 'Debes completar los campos requeridos'});

    const imgPath = req.file?.filename;
    const relativePath = `/img/products/${imgPath}`;
    thumbnail.push(relativePath);

    const productInfo = {
        name,
        description,
        category,
        code,
        price,
        thumbnail,
        stock
    };

    try {
        const response = await addProduct(productInfo);
        res.status(201).json({status: response.status? response.status : 'success', message: response.message, payload: response.payload? response.payload : {}});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({status: 'error', error: error.message});
    }
});

router.patch('/:pid', /* handlePolicies('ADMIN'), */ async (req, res) => {
    const { pid } = req.params;
    const { name, description, category, code, price, thumbnail, stock } = req.body;

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

router.delete('/:pid',/*  handlePolicies('ADMIN'), */ async (req, res) => {
    const { pid } = req.params;

    try {
        const response = await deleteProduct(pid);
        res.json({message: response});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({message: 'Error al eliminar el producto'});
    }
});

router.delete('/',/*  handlePolicies('ADMIN'), */ async (req, res) => {
    try {
        const response = await deleteAllProducts();
        res.json({message: response});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar los productos'})
    }
});

export default router;