'use client';

import Link from 'next/link';

export default function Features() {
  const features = [
    {
      title: 'Phòng nghỉ sang trọng',
      desc: 'Không gian thoải mái, tiện nghi chuẩn 5 sao.',
      href: '/features/room',
    },
    {
      title: 'View biển tuyệt đẹp',
      desc: 'Tận hưởng cảnh biển ngay tại phòng.',
      href: '/features/view',
    },
    {
      title: 'Ẩm thực đa dạng',
      desc: 'Nhà hàng quốc tế phục vụ 24/7.',
      href: '/features/food',
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Tiện ích nổi bật</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Link
              key={i}
              href={f.href}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left block"
            >
              <h3 className="text-xl font-semibold mb-2 text-black">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
