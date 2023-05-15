import User from "../models/user.models.js";

class UserManager {

    register = async (newUserInfo) => {
        try {
            const newUser = await User.create(newUserInfo);
            return newUser;
        } catch (error) {
            throw error;
        }
    };

    findByQuery = async (query) => {
        try {
            const user = await User.findOne(query);
            return user? user : {}
        } catch(error) {
            throw error;
        }
    };

    findById = async (idRef) => {
        try {
            const user = await User.findById(idRef);
            return user? user : {};
        } catch(error) {
            throw error;
        }
    };

    update = async (idRef, update) => {
        try {
            await User.findByIdAndUpdate(idRef, update)
            return update;
        } catch(error) {
            throw error;
        }
    };
};

export default UserManager;