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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;

    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/rating?propertyId=${propertyId}`);
        if (!res.ok) throw new Error('Failed to fetch rating');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Rating fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [propertyId]);

  if (loading) {
    return (
      <span className={`flex gap-1 items-center ${inPage ? 'text-md' : 'text-xs'} opacity-50`}>
        <FaStar className="w-3 h-3" />
        ...
      </span>
    );
  }

  if (!data || data.count === 0) return null;

  const className = `flex gap-1 items-center ${inPage ? 'text-md' : 'text-xs'}`;
  const countText = data.count === 1 ? 'review' : 'reviews';
  const countValue = `(${data.count}) ${inPage ? countText : ''}`;

  return (
    <span className={className}>
      <FaStar className="w-3 h-3 text-yellow-500" />
      {data.rating} {countValue}
    </span>
  );
}
