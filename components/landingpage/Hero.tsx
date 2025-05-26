'use client'

export default function Hero() {
  return (
    <section className="bg-[url('/hotel.jpg')] bg-cover bg-center h-screen text-white flex flex-col justify-center items-center px-6 text-center">
      <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">Khám phá Khách sạn Mơ Ước</h1>
      <p className="text-xl mb-6 max-w-xl drop-shadow-lg">Trải nghiệm kỳ nghỉ tuyệt vời với dịch vụ cao cấp, vị trí đắc địa và phong cách đẳng cấp.</p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">Đặt phòng ngay</button>
    </section>
  )
}
