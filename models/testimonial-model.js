import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema({
    content: {
        required: true,
        type: String,
    },
    userId: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
    courseId: {
        type: Schema.ObjectId,
        ref: "Course",
        required: true,
    },
    rating: {
        required: true,
        type: Number,
    },
});

export const Testimonial =
    mongoose.models.Testimonial ||
    mongoose.model("Testimonial", testimonialSchema);