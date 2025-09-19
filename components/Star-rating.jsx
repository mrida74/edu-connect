
import Image from "next/image";
import { Star } from "lucide-react";

export function StarRating({ rating }) {
  const stars = new Array(rating).fill(0);

  return (
    <>
      {stars.map((star, index) => (
        <Star key={index} fill="currentColor" className="text-black-400 w-4 h-4" />
      ))}
    </>
  );
}