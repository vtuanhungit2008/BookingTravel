'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

type TopProperty = {
  id: string;
  name: string;
  image: string;
  tagline: string;
  rating: string;
  reviewCount: number;
};

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-gray-200 animate-pulse h-[200px] relative" />
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
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Các điểm đến nổi bật
        </h2>
        <p className="text-gray-500 mb-10">Lựa chọn khách sạn phổ biến nhất tại Việt Nam</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties
            ? properties.map((item) => (
                <Link
                  key={item.id}
                  href={`/properties/${item.id}`}
                  className="relative rounded-xl overflow-hidden group shadow hover:shadow-lg transition"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={600}
                    height={400}
                    className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white z-10">
                    <h3 className="text-lg font-semibold flex items-center gap-1">
                      {item.name} <span>🇻🇳</span>
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-1">{item.tagline}</p>
                    <p className="text-sm flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                      {item.rating} / 5 ({item.reviewCount})
                    </p>
                  </div>
                </Link>
              ))
            : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </section>
  );
}
