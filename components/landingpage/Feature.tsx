'use client'
export default function Features() {
  const features = [
    { title: 'Phòng nghỉ sang trọng', desc: 'Không gian thoải mái, tiện nghi chuẩn 5 sao.' },
    { title: 'View biển tuyệt đẹp', desc: 'Tận hưởng cảnh biển ngay tại phòng.' },
    { title: 'Ẩm thực đa dạng', desc: 'Nhà hàng quốc tế phục vụ 24/7.' },
  ]

  return (
    <section className="py-20 px-6 bg-gray-50 h-[88vh]">
      <div className="max-w-5xl pt-12 mt-5 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Tiện ích nổi bật</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
