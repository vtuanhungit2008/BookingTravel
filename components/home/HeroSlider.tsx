'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useEffect } from 'react';

const slides = [
  {
    image: '/images/city/danang.jpg',
    title: 'Khám phá Khách sạn Mơ Ước',
    subtitle: 'Tìm nơi nghỉ lý tưởng cho kỳ nghỉ tiếp theo của bạn.',
  },
  {
    image: '/images/city/hcm.jpeg',
    title: 'Tận hưởng view biển',
    subtitle: 'Phòng nghỉ sát biển, đón bình minh từ ban công.',
  },
  {
    image: '/images/city/nhatrang.jpg',
    title: 'Thư giãn cùng hồ bơi vô cực',
    subtitle: 'Chìm đắm trong không gian sang trọng và hiện đại.',
  },
];

export default function HeroSlider() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
  });

  // ✅ Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(timer);
  }, [instanceRef]);

  return (
    <div ref={sliderRef} className="keen-slider h-[88vh] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative bg-cover bg-center flex items-center justify-center text-white"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-xl mb-4">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl drop-shadow-lg max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
