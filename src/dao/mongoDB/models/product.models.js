import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    code: {
        type: String,
        index: true
    },
    price: Number,
    thumbnail: Array,
    stock: Number,
    owner: {
        type: String,
        default: 'admin'
    }
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(productsCollection, productSchema);

export default Product;