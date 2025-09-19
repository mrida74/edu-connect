import { StarRating } from "@/components/Star-rating";
import Image from "next/image";

function TestimonialCard({ testimonial }) {
     return (
    <div className="sm:break-inside-avoid">
      <blockquote className="rounded-lg bg-gray-50 p-6  sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            alt=""
            src={testimonial?.userId?.profile_picture}
            width="56"
            height="56"
            className="size-14 rounded-full object-cover"
          />
          <div>
            <p className="mt-0.5 text-lg font-medium text-gray-900">
              {testimonial?.userId?.firstName} {testimonial?.userId?.lastName}
            </p>
            <div className="flex justify-center gap-0.5 text-yellow-600">
              <StarRating rating={testimonial?.rating} />
            </div>
          </div>
        </div>
        <p className="mt-4 text-gray-700">{testimonial?.content}</p>
      </blockquote>
    </div>
  );
}

export default TestimonialCard;
