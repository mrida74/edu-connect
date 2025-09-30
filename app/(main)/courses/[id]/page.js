import { getCourseDetails } from "@/db/quaries/courses";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import RelatedCourses from "./_components/RelatedCourses";
import Testimonials from "./_components/Testimonials";
import CourseDetails from "./_components/CourseDetails";



const SingleCoursePage = async ({params: {id}}) => {
    const course = await getCourseDetails(id);
    
    return (
        <>
             
            <CourseDetailsIntro
                courseId={course?.id}
                title={course?.title}
                subtitle={course?.subtitle}
                thumbnail={course?.thumbnail} />

            <CourseDetails course={course} />

            {course?.testimonials && <Testimonials testimonials={course?.testimonials} />}

            <RelatedCourses />
        </>
    );
};
export default SingleCoursePage;