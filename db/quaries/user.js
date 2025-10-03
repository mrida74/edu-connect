import { replaceMongoIdInObject } from "@/lib/convertData";
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
        
        if (user && user.name && !user.firstName) {
            // Handle legacy Google users during transition
            const nameParts = user.name.trim().split(" ");
            return {
                ...user,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                role: user.role || "student",
                profilePicture: user.profilePicture || user.image || "/assets/images/profile.jpg",
                provider: user.provider || "google"
            };
        }
        
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};
const getUserById = async (id) => {
    try {
        await dbConnect();
        const user = await User.findById(id).lean();
        return replaceMongoIdInObject(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

export { getAllUsers, getUserByEmail, getUserById };
