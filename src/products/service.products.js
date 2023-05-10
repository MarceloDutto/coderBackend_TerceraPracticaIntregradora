import ProductManager from "../dao/mongoDB/persistence/productsManager.mongoDB.js";
const pm = new ProductManager();
import productsDTO from "../DTOs/products.dto.js";

export const getProducts = async (limit, page, query, sort) => {
    let filter = {};
    query? filter = { category: query } : filter = {};
    
    const sortLowercase = sort? sort.toLowerCase() : sort;

    const options = {
        limit, 
        page,
        sort: { price: sortLowercase }
    }

    try {
        const products = await pm.getAll(filter, options);
        if(products.payload.length === 0) return {status: 'failed', message: 'La base de datos no contiene productos'};

        return {message: 'Productos encontrados en la base de datos', payload: products};
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (idRef) => {
    try {
        const productById = await pm.getById(idRef);
        if(Object.keys(productById).length === 0) return {status: 'failed', message: 'Producto no encontrado en la base de datos', payload: productById};
        const mappedProduct = new productsDTO(productById)
        return {message: 'Producto encontrado', payload: mappedProduct};
    } catch (error) {
        throw error;
    }
};

export const addProduct = async (productInfo) => {
    try {
        const { code } = productInfo;
        const productByCode = await pm.getByQuery({code: code});
        if(Object.keys(productByCode).length !== 0) return {status: 'failed', message: 'El producto ya se encuentra ingresado en la base de datos'};

        const added = await pm.add(productInfo);
        const newProduct = new productsDTO(added);

        return {message: 'El producto fue ingresado correctamente', payload: newProduct};
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (idRef, updates) => {
    try {
        const product = await pm.getById(idRef);
        if(Object.keys(product).length === 0) return {status: 'failed', message: 'Producto no encontrado en la base de datos'};

        Object.keys(updates).forEach(key => {
            if(updates[key] && updates[key] !== product[key]) product[key] = updates[key];
        })

        const updatedProduct = await pm.update(idRef, product);
        return {message: 'Producto actualizado', payload: updatedProduct};
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (idRef) => {
    try {
        const response = await pm.delete(idRef);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteAllProducts = async () => {
    try {
        const response = await pm.deleteAll();
        return response;
    } catch (error) {
        throw error;
    }
};
