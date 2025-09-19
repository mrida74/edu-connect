import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { Course } from "@/models/course-model";
import { Category } from "@/models/category-model";
import { User } from "@/models/user-model";
import { Testimonial } from "@/models/testimonial-model";
import { Module } from "@/models/module-model";
import en from "zod/v4/locales/en.cjs";
import { getEnrollmentByCourseId } from "./enrollment";
import { getTestimonialsByCourseId } from "./testimonial";

const getCourseList = async () => {
  try {
    const courses = await Course.find({})
      .select(
        "title description thumbnail category instructor price active testimonials modules"
      )
      .populate("category")
      .populate("instructor")
      .populate("testimonials")
      .populate("modules")
      .lean();

    const plainCourses = courses.map((course) => {
      return {
        ...replaceMongoIdInObject(course),
        category: course.category?._id
          ? replaceMongoIdInObject(course.category)
          : course.category,
        instructor: course.instructor?._id
          ? replaceMongoIdInObject(course.instructor)
          : course.instructor,
        testimonials: Array.isArray(course.testimonials)
          ? replaceMongoIdInArray(course.testimonials)
          : course.testimonials,
        modules: Array.isArray(course.modules)
          ? replaceMongoIdInArray(course.modules)
          : course.modules,
      };
    });

    return plainCourses;
  } catch (error) {
    throw new Error("Error fetching courses: " + error.message);
  }
};
const getCourseDetails = async (courseId) => {
  try {
    const course = await Course.findById(courseId)
      .populate("category")
      .populate("instructor")
      .populate({
        path: "testimonials",
        model: Testimonial,
        populate: { path: "userId", model: User },
      })
      .populate("modules")
      .lean();
    if (!course) {
      throw new Error("Course not found");
    }
    const plainCourse = {
      ...replaceMongoIdInObject(course),
      category: course.category?._id
        ? replaceMongoIdInObject(course.category)
        : course.category,
      instructor: course.instructor?._id
        ? replaceMongoIdInObject(course.instructor)
        : course.instructor,
      testimonials: Array.isArray(course.testimonials)
        ? course.testimonials.map((testimonial) => ({
            ...replaceMongoIdInObject(testimonial),
            userId: testimonial.userId?._id
              ? replaceMongoIdInObject(testimonial.userId)
              : testimonial.userId,
              
          }))
        : course.testimonials,
      modules: Array.isArray(course.modules)
        ? replaceMongoIdInArray(course.modules)
        : course.modules,
    };
    return plainCourse;
  } catch (error) {
    throw new Error("Error fetching course details: " + error.message);
  }
};

const getCourseDetailsByInstructor = async (instructorId) => {
    try {
      const courses = await Course.find({ instructor: instructorId })
      const plainCourses = courses.map(course => replaceMongoIdInObject(course));

      const enrollments = await Promise.all(
        plainCourses.map(async (course) => {
          const enrollment = await getEnrollmentByCourseId(course.id);
          return enrollment;
        })
    );
    
    const testimonials = await Promise.all(
      plainCourses.map(async (course) => {
        const testimonial = await getTestimonialsByCourseId(course.id);
        return testimonial;
      })
    );
    let totalRating = testimonials.flat().reduce((acc, testimonial) => acc + (testimonial.rating || 0), 0);

      return {
        courses: plainCourses,
        enrollments: enrollments.flat(),
        testimonials: testimonials.flat(),
        rating : totalRating / (testimonials.flat().length || 1),
      }
    } catch (error) {
      throw new Error("Error fetching courses by instructor: " + error.message);
    }

};

export { getCourseList, getCourseDetails, getCourseDetailsByInstructor };
