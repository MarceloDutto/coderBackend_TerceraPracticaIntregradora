import Cart from "../models/cart.models.js";

class CartManager {

    getAll = async () => {
        try {
            const data = await Cart.find();
            return data
        } catch (error) {
            throw error;
        }
    };

    getById = async (idRef) => {
        try {
            const data = await Cart.findOne({_id: idRef});
            return data? data : {};
        } catch (error) {
            throw error;
        }
    };

    add = async () => {
        try {
            const newCart = await Cart.create({products: []});
            return newCart;
        } catch (error) {
            throw error;
        }
    };

    getProductIndex = async (pid, cart) => {
        try {
            const index = await cart.products.findIndex(prod => prod.product.equals(pid));
            return index;
        } catch(error) {
            throw error;
        }
    };

    update = async (cidRef, update) => {
        try {
            await Cart.updateOne({_id: cidRef}, update);
        } catch (error) {
            throw error;
        }
    };
    
    delete = async (cidRef) => {
        try {
            await Cart.findByIdAndDelete(cidRef);
            return 'Carrito eliminado de la base de datos';
        } catch (error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            await Cart.deleteMany();
            return 'Todos los carritos fueron eliminados';
        } catch (error) {
            throw error;
        }
    };

};

export default CartManager;