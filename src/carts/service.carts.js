import CartManager from "../dao/mongoDB/persistence/cartsManager.mongoDB.js";
import ProductManager from "../dao/mongoDB/persistence/productsManager.mongoDB.js";
import { createTicket } from "../tickets/service.tickets.js";

const cm =  new CartManager();
const pm = new ProductManager();

export const getCarts = async () => {
    try {
        const carts = await cm.getAll();
        if(carts.length === 0) return {message: 'La base de datos no contiene carritos'};
        return {message: 'Carritos encontrados en la base de datos', payload: carts};
    } catch (error) {
        throw error;
    }
};

export const getCartById = async (cidRef) => {
    try {
        const cartById = await cm.getById(cidRef);
        if(Object.keys(cartById).length === 0) return {message: 'Carrito no encontrado en la base de datos'};
        return {message: 'Carrito encontrado', payload: cartById};
    } catch (error) {
        throw error;
    }
};

export const addCart = async () => {
    try {
        const newCart = await cm.add();
        return {message: 'Carrito creado', payload: newCart};
    } catch (error) {
        throw error;
    }
};

export const addProductToCart = async (cidRef, pidRef) => {
    try {
        const cart = await cm.getById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        const product = await pm.getById(pidRef);
        if(Object.keys(product).length === 0) return {status: 'failed', message: 'Producto no encontrado en la base de datos'};
        
        const prodIndex = await cm.getProductIndex(pidRef, cart);
        
        if(prodIndex !== -1) {
            cart.products[prodIndex].quantity ++;
            await cm.update(cidRef, cart);
            return {message: 'Producto actualizado con éxito'};
        } else {
            cart.products.push({product: pidRef, quantity: 1});
            await cm.update(cidRef, cart);
            return {message: 'Producto agregado al carrito'};
        }
    } catch (error) {
        throw error;
    }
};

export const updateProductsfromCart = async (cidRef, products) => {
    try {
        const cart = await cm.getById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        let invalidProducts = [];

        for (let i = 0; i < products.length; i++) {
            try {
              let id = products[i].product.id;
              const response = await pm.getById(id);
          
              if (Object.keys(response).length !== 0) invalidProducts.push(response);
            } catch (error) {
              throw error;
            }
          }
        
        if(invalidProducts.length === 0) {
            cart.products = products;
            await cm.update(cidRef, cart);
            return {message: 'Productos del carrito actualizados'};
        } else {
            return {status: 'failed', message: 'Error al ingresar los productos'};
        }
    } catch (error) {
        throw error;
    }
};

export const updateQuantity = async (cidRef, pidRef, quantity) => {
    try {
        const cart = await cm.getById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        if(cart.products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        const prodIndex = await cm.getProductIndex(pidRef, cart);
        if(prodIndex === -1) return {status: 'failed', message: 'El producto no se encontró en el carrito'};

        cart.products[prodIndex].quantity = quantity
        await cm.update(cidRef, cart);
        return {status: 'success', message: 'Producto actualizado'};
    } catch (error) {
        throw error;
    }
};

export const deleteProductfromCart = async (cidRef, pidRef) => {
    try {
        const cart = await cm.getById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        if(cart.products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        const prodIndex = await cm.getProductIndex(pidRef, cart);
        if(prodIndex === -1) return {status: 'failed', message: 'El producto no se encontró en el carrito'};

        cart.products.splice(prodIndex, 1);
        await cm.update(cidRef, cart);
        return {status: 'success', message: 'Producto eliminado del carrito'};
    } catch (error) {
        throw error;
    }
};

export const deleteProductsfromCart = async (cidRef) => {
    try {
        const cart = await cm.getById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        if(cart.products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        cart.products = [];
        await cm.update(cidRef, cart);
        return {status: 'success', message: 'Productos eliminados del carrito'};
    } catch(error) {
        throw error;
    }
};

export const purchase = async (cidRef, user) => {
    try {
        const cart = await cm.getById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};
        const products = cart.products;
        if(products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        let purchasedProducts = [];
        let rejectedProducts = [];

        for (const prod of products) {
            let id = prod.product.id
            let price = prod.product.price;
            let quantity = prod.quantity;

            let product = await pm.getById(id);
          
            if (quantity <= product.stock) {
              try {
                await pm.update(id, {stock: product.stock - quantity});
                const subtotal = price * quantity;
                const item = {
                    product: product.id,
                    subtotal
                };
                purchasedProducts.push(item);
                const prodIndex = await cm.getProductIndex(id, cart);
                cart.products.splice(prodIndex, 1);
            } catch (error) {
                throw error;
            }
        } else {
            rejectedProducts.push(product.id);
        };
    }; 
    
    await cm.update(cidRef, cart);
    if(purchasedProducts.length === 0) return {status: 'failed', message: 'La compra no pudo realizarse. Revise el stock antes de comprar.', payload: rejectedProducts};

    const amount = purchasedProducts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.subtotal;
    }, 0);

    const ticketInfo = {
        amount,
        purchaser: /* user.fullname */ 'marce'
    };

    const purchaseTicket = await createTicket(ticketInfo);
    if(rejectedProducts.length > 0) return {message: 'Algunos productos de tu carrito no tienen stock. La compra fue realizada exitosamente con los productos disponibles', payload: purchaseTicket};

    return {message: 'Compra realizada exitosamente', payload: purchaseTicket};
    } catch(error) {
        throw error;
    }
};