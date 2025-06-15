'use client';

import Image from 'next/image';
import Link from 'next/link';

const destinations = [
  {
    name: 'TP. Hồ Chí Minh',
    image: '/image1.jpeg',
    href: '/search?city=ho-chi-minh',
  },
  {
    name: 'Đà Nẵng',
    image: '/image1.jpeg',
    href: '/search?city=da-nang',
  },
  {
    name: 'Vũng Tàu',
    image: '/image1.jpeg',
    href: '/search?city=vung-tau',
  },
  {
    name: 'Hà Nội',
    image: '/image1.jpeg',
    href: '/search?city=ha-noi',
  },
  {
    name: 'Đà Lạt',
    image: '/image1.jpeg',
    href: '/search?city=da-lat',
  },
];

export default function DestinationGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">Điểm đến đang thịnh hành</h2>
      <p className="text-gray-500 mb-8">Các lựa chọn phổ biến nhất cho du khách tại Việt Nam</p>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {destinations.map((d, i) => (
          <Link
            key={i}
            href={d.href}
            className="relative rounded-xl overflow-hidden group shadow hover:shadow-lg transition"
          >
            <Image
              src={d.image}
              alt={d.name}
              width={500}
              height={300}
              className="object-cover w-full h-[180px] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 z-10 text-white">
              <h3 className="font-semibold text-lg flex items-center gap-1 drop-shadow">
                {d.name} <span>🇻🇳</span>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
