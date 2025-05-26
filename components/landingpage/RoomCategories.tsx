'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type TopProperty = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: string;
  reviewCount: number;
};

const SkeletonCard = () => (
  <div className="bg-gray-100 animate-pulse rounded-2xl p-4 shadow-md text-left">
    <div className="h-48 w-full bg-gray-300 rounded-md mb-3" />
    <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-1" />
    <div className="h-4 w-1/3 bg-gray-200 rounded" />
  </div>
);

export default function Features() {
  const [properties, setProperties] = useState<TopProperty[] | null>(null);

  useEffect(() => {
    const fetchTop = async () => {
      const res = await fetch('/api/top-rated-properties');
      const data = await res.json();
      setProperties(data);
    };
    fetchTop();
  }, []);

  return (
    <section className="py-20 bg-white min-h-[88vh]">
      <div className="max-w-5xl pt-12 mt-5 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Top khách sạn được yêu thích</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {properties
            ? properties.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-2xl p-4 shadow-md text-left">
                  <div className="relative h-48 w-full rounded-md overflow-hidden mb-3">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{hotel.tagline}</p>
                  <p className="text-sm">
                    ⭐ {hotel.rating} / 5 ({hotel.reviewCount} đánh giá)
                  </p>
                </div>
              ))
            : Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </section>
  );
}
