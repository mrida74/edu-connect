import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { handleClientScriptLoad } from "next/script";
import { createCheckoutSession } from "@/app/actions/stripe";
import Link from "next/link";

function Enrollment({ linkType , courseId }) {
  
  return (
    <>
      {linkType ? (
        <Link
          href={`/courses/${courseId}/purchase`}
          className="text-xs text-sky-700 h-7 gap-1"
        >
          Enroll
          <ArrowRight className="w-3" />
        </Link>
      ) : (
        <Link
          href={`/courses/${courseId}/purchase`}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Enroll Now
        </Link>
      )}
    </>
  );
}

export default Enrollment;
