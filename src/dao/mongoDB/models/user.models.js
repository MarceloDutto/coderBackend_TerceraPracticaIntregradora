import mongoose from "mongoose";

const userCollection = 'users';
const userTypes = ['user', 'premium', 'admin'];

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    cart: String,
    role: {
        type: String,
        enum: userTypes,
        default: 'user',
    },
    recoveryToken: {
        type: String,
        default: ''
    },
    recoveryTokenExpiration: {
        type: String,
        default: ''
    }
});

const User = mongoose.model(userCollection, userSchema);

export default User;