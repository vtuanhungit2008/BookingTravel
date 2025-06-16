'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEllipsisH } from 'react-icons/fa';

const destinations = [
  { name: 'TP. Hồ Chí Minh', image: '/images/city/hcm.jpeg' },
  { name: 'Đà Nẵng', image: '/images/city/danang.jpg' },
  { name: 'Vũng Tàu', image: '/images/city/caobang.jpg' },
  { name: 'Hà Nội', image: '/images/city/hanoi.jpg' },
  { name: 'Đà Lạt', image: '/images/city/dalat.jpg' },
  { name: 'Nha Trang', image: '/images/city/nhatrang.jpg' },
  { name: 'Huế', image: '/images/city/hue.jpg' },
];

export default function DestinationGrid() {
  const router = useRouter();

  const goToLocation = (locationName: string) => {
    const encoded = encodeURIComponent(locationName);
    router.push(`/?location=${encoded}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Điểm đến đang thịnh hành</h2>
      <p className="text-gray-500 mb-10">Các lựa chọn phổ biến nhất cho du khách tại Việt Nam</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {destinations.map((d, i) => (
          <div
            key={i}
            onClick={() => goToLocation(d.name)}
            className="relative rounded-xl overflow-hidden group shadow hover:shadow-lg transition cursor-pointer"
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
          </div>
        ))}

        {/* Mục "Xem thêm" */}
        <div
          onClick={() => goToLocation('Tỉnh Cao Bằng')}
          className="relative cursor-pointer rounded-xl overflow-hidden group shadow hover:shadow-lg transition"
        >
          <Image
            src="/images/city/hcm1.jpg"
            alt="Tỉnh Cao Bằng"
            width={500}
            height={300}
            className="object-cover w-full h-[180px] opacity-60 group-hover:opacity-70 transition"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
            <FaEllipsisH className="text-2xl mb-2" />
            <span className="text-sm font-semibold">Khám phá thêm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
