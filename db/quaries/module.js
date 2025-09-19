import { replaceMongoIdInArray } from "@/lib/convertData";
import { Module } from "@/models/module-model";
import { Lesson } from "@/models/lesson-model";     

const getModuleByCourseId = async (courseId) => {
  try {
    const modules = await Module.find({ course: courseId })
      .populate({
        path: "lessonIds",
        model: Lesson,
      })
        .lean();
    return replaceMongoIdInArray(modules);
  } catch (error) {
    throw new Error("Error fetching modules");
  }
};

export { getModuleByCourseId };
