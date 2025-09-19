import { replaceMongoIdInArray } from "@/lib/convertData";

const { Testimonial } = require("@/models/testimonial-model");


const getTestimonialsByCourseId = async (courseId) => {
    try {
        const testimonials = await Testimonial.find({ courseId }).lean();
        return replaceMongoIdInArray(testimonials);
    } catch (error) {
        throw new Error("Error fetching testimonials: " + error.message);
    }
}

export { getTestimonialsByCourseId };