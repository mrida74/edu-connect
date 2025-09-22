import { User } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";



const getAllUsers = async () => {
    try {
        await dbConnect();
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
const getUserByEmail = async (email) => {
    try {
        await dbConnect();
        const user = await User.findOne({ email }).lean();
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

export { getAllUsers, getUserByEmail };
