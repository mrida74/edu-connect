import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllLessons } from "@/db/quaries/lessons";
import { getModuleByCourseId } from "@/db/quaries/module";
import { getTotalHourMinute } from "@/lib/CalculateTotalTime";
import { cn } from "@/lib/utils";
import { AccordionContent } from "@radix-ui/react-accordion";
import {
  BookCheck,
  Clock10,
  FileQuestion,
  NotepadText,
  Radio,
  StickyNote,
  Tv,
  Video,
} from "lucide-react";
import CourseModuleList from "./module/CourseModuleList";


const CourseCurriculam = async ({ courseId }) => {
  const modules = await getModuleByCourseId(courseId);
  const courseDuration = await getTotalHourMinute(modules);
  

  return (
    <>
      <div className="flex gap-x-5 items-center justify-center flex-wrap mt-4 mb-6 text-gray-600 text-sm">
        <span className="flex items-center gap-1.5">
          <BookCheck className="w-4 h-4" />
           {modules.length} Chapters
        </span>
        <span className="flex items-center gap-1.5">
          <Clock10 className="w-4 h-4" />
          {courseDuration.hours} Hours {courseDuration.minutes} Minutes 
        </span>
        <span className="flex items-center gap-1.5">
          <Radio className="w-4 h-4" />4 Live Class
        </span>
      </div>
      <Accordion
        defaultValue={["item-1", "item-2", "item-3"]}
        type="multiple"
        collapsible
        className="w-full"
      >
        {modules && modules.map((module) => (<CourseModuleList key={module.id} module={module} />))}
      </Accordion>
    </>
  );
}

export default CourseCurriculam;
