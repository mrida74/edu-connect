import Test from "@/components/Test";
import { getAllCourses } from "@/db/quaries/courses";


export default async function Home() {
  const courses = await getAllCourses();
  console.log("Courses:", courses);
  return (
    <Test />
  );
}
