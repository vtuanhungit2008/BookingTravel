'use client';

import { FaStar } from 'react-icons/fa';

export default function PropertyRating({
  rating,
  count,
  inPage,
}: {
  rating?: number | string | null;
  count?: number;
  inPage: boolean;
}) {
  if (rating === null || rating === undefined || count === undefined) {
    return (
      <span className={`${inPage ? 'text-md' : 'text-xs'} text-gray-400 italic`}>
        Chưa có đánh giá
      </span>
    );
  }

  return (
    <span className={`flex gap-1 items-center ${inPage ? 'text-md' : 'text-xs'}`}>
      <FaStar className="w-3 h-3 text-yellow-500" />
      {rating} ({count} {inPage ? 'reviews' : ''})
    </span>
  );
}
