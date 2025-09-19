import { replaceMongoIdInArray } from "@/lib/convertData";
import { Category } from "@/models/category-model";

const getAllCategories = async () => {
    try {
        const categories = await Category.find({}).lean();
        return replaceMongoIdInArray(categories);
    } catch (error) {
        throw new Error("Error fetching categories: " + error.message);
    }
};

export { getAllCategories };