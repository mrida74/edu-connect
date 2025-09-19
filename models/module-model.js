import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  slug: {
    required: true,
    type: String,
  },
  course: {
    required: true,
    type: Schema.ObjectId,
  },
  lessonIds: [
  {
    type: Schema.ObjectId,
    ref: "Lesson"
  }
]
});

export const Module = mongoose.models.Module || mongoose.model("Module", moduleSchema);