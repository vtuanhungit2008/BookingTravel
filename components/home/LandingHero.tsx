'use client'

import VisualSearch from "../ai/clip"
import CallToAction from "../landingpage/CallToAction"
import Features from "../landingpage/Feature"

import RoomCategories from "../landingpage/RoomCategories"



export default function LandingHero() {
  return (
    <section>
    <div className="bg-[url('/image1.jpeg')] bg-cover bg-center h-[88vh] text-white flex flex-col justify-center items-center px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold drop-shadow-xl">Khám phá Khách sạn Mơ Ước</h1>
      <p className="text-lg md:text-xl mt-4 drop-shadow-lg max-w-2xl">Tìm kiếm nơi nghỉ lý tưởng cho kỳ nghỉ tiếp theo của bạn với dịch vụ tốt nhất.</p>
    </div>
      
    <Features/>

    <RoomCategories/>
       <VisualSearch/>
   
    
    
  
    </section>
  )
}
