import { Enrollment } from "@/models/enrollment-model";
import { User } from "@/models/user-model";
import { Course } from "@/models/course-model";

const getEnrollmentByCourseId = async (courseId) => {
  try {
    const enrollments = await Enrollment.find({ course_id: courseId }).lean();
    return enrollments;
  } catch (error) {
    throw new Error("Error fetching enrollments: " + error.message);
  }
};

const getEnrollmentByUserId = async (userId) => {
  const enrollments = await Enrollment.find({ user_id: userId }).lean();
  return enrollments;
};
const getAllEnrollments = async () => {
  const enrollments = await Enrollment.find({})
    .populate("user_id")
    .populate("course_id")
    .lean();
  return enrollments;
};

export { getEnrollmentByCourseId, getEnrollmentByUserId, getAllEnrollments };
