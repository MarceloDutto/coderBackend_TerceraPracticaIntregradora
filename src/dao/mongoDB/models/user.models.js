import mongoose from "mongoose";

const userCollection = 'users';

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
        enum: ['user', 'premium', 'admin'],
        default: 'user'
    }
});

const User = mongoose.model(userCollection, userSchema);

export default User;