import mongoose, {Schema} from "mongoose";
import { Noto_Sans_Telugu } from "next/font/google";


const lessonSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  duration: {
    type: String,
    required: true,
  },
  video_url: {
    required: true,
    type: String,
  },
  published: {
    required: true,
    type: Boolean,
  },
  slug: {
    required: true,
    type: String,
  },
  access: {
    required: true,
    type: String,
  },
});

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);

export { Lesson };
