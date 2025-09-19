import { Lesson } from "@/models/lesson-model";

const getAllLessons = async () => {
  try {
    const lessons = await Lesson.find({}).lean();
    return lessons;
  } catch (error) {
    throw new Error("Error fetching lessons");
  }
};

export { getAllLessons };
