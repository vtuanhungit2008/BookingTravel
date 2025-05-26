'use client';

import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function PropertyRating({
  propertyId,
  inPage,
}: {
  propertyId: string;
  inPage: boolean;
}) {
  const [data, setData] = useState<{ rating: number; count: number } | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      const res = await fetch(`/api/rating?propertyId=${propertyId}`);
      const json = await res.json();
      setData(json);
    };
    fetchRating();
  }, [propertyId]);

  if (!data || data.count === 0) return null;

  const className = `flex gap-1 items-center ${inPage ? "text-md" : "text-xs"}`;
  const countText = data.count === 1 ? "review" : "reviews";
  const countValue = `(${data.count}) ${inPage ? countText : ""}`;

  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {data.rating} {countValue}
    </span>
  );
}
