import Product from "../models/product.models.js";
import productsDTO from "../../../DTOs/products.dto.js";

class ProductManager {

    getAll = async (filter, options)  => {
        try {
            const data = await Product.paginate(filter, options);
            const mappedData = data.docs.map(doc => new productsDTO(doc));

            const response = {
                status: "success",
                payload: mappedData,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                page: data.page,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink: `?limit=${options.limit}&page=${data.prevPage}`,
                nextLink: `?limit=${options.limit}&page=${data.nextPage}`
            } 
            return response;
        } catch(error) {
            throw error;
        }
    };

    getById = async (idRef) => {
        try {
            const data = await Product.findById(idRef);
            if(!data) return {}
            return data;
        } catch (error) {
            throw error;
        }
    };

    getByQuery = async (query) => {
        try {
            const data = await Product.find(query);
            if(!data) return {};
            return data;
        } catch (error) {
            throw error;
        }
    };

    add = async (info) => {
        try {
            const newProduct = await Product.create(info);
            return newProduct;
        } catch (error) {
            throw error;
        }
    };

    update = async (idRef, product) => {
        try {
            await Product.findByIdAndUpdate(idRef, product);
            return product;
        } catch (error) {
            throw error;
        }
    };

    delete = async (idRef) => {
        try {
            await Product.findByIdAndDelete(idRef);
            return 'Producto eliminado de la base de datos';
        } catch (error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            await Product.deleteMany();
            return 'Todos los productos fueron eliminados';
        } catch (error) {
            throw error;
        }
    };
};

export default ProductManager;