'use client';
import { useRef } from 'react';

export default function CallToAction() {
  
  const targetRef = useRef<HTMLDivElement | null>(null);

 
  const handleScrollToDiv = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth', 
        block: 'end', 
      });

      
      window.scrollBy({
        top: 600, 
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-gray text-black h-[40vh] py-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Sẵn sàng cho kỳ nghỉ?</h2>
      <p className="mb-6 text-xl">Chỉ vài bước đơn giản để đặt phòng khách sạn mơ ước của bạn.</p>
      <button
        className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition"
        onClick={handleScrollToDiv} 
      >
        Bắt đầu đặt phòng
      </button>

      <div ref={targetRef} >
        
      </div>
    </section>
  );
}
