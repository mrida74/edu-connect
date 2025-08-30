import { Category } from "@/models/category-model";
import Course from "@/models/course-model";
import { Module } from "@/models/module-model";
import { Testimonial } from "@/models/testimonial-model";
import User from "@/models/user-model";


const  getAllCourses = async () => {
    try {
        const courses = await Course.find({}).populate({
        path: "category",
        model: Category
    }).populate({
        path: "instructor",
        model: User
    }).populate({
        path: "testimonials",
        model: Testimonial
    }).populate({
        path: "modules",
        model: Module
    });
        return courses;
    } catch (error) {
        throw new Error("Error fetching courses");
    }
};

export { getAllCourses };
