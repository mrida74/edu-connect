import User from "@/models/user-model";



const getAllUsers = async () => {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export { getAllUsers };
