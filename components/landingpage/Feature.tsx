'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideHotel, LucideMountain, LucideUtensils } from 'lucide-react';

const features = [
  {
    title: 'Phòng nghỉ sang trọng',
    desc: 'Không gian thoải mái, nội thất cao cấp, đậm chất nghỉ dưỡng.',
    href: '/features/room',
    icon: <LucideHotel className="w-8 h-8 text-gray-700 group-hover:text-black transition" />,
  },
  {
    title: 'View biển tuyệt đẹp',
    desc: 'Thức dậy cùng ánh nắng và khung cảnh đại dương tuyệt mỹ.',
    href: '/features/view',
    icon: <LucideMountain className="w-8 h-8 text-gray-700 group-hover:text-black transition" />,
  },
  {
    title: 'Ẩm thực đa dạng',
    desc: 'Tận hưởng ẩm thực từ các đầu bếp quốc tế suốt 24/7.',
    href: '/features/food',
    icon: <LucideUtensils className="w-8 h-8 text-gray-700 group-hover:text-black transition" />,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Tiện ích nổi bật</h2>
        <p className="text-gray-500 text-lg mb-14">
          Trải nghiệm dịch vụ đẳng cấp được thiết kế dành riêng cho bạn.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <Link
                href={feature.href}
                className="block group bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-black">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
