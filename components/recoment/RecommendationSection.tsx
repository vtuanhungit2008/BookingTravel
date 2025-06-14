"use client";

import { useEffect, useState } from "react";
 // thay bằng component của bạn
import { useUser } from "@clerk/nextjs"; // nếu bạn dùng Clerk để xác thực
import PropertyCard from "../card/PropertyCard";

export const RecommendationSection = () => {
  const [data, setData] = useState([]);
  const { user } = useUser(); // từ Clerk

    
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const res = await fetch(`/api/recommendations?userId=${user.id}`);
      const result = await res.json();
      console.log("resul",result);
      
      
      setData(result);
    };

    fetchData();
  }, [user?.id]);

  if (!data.length) return null;
  console.log(data);
  
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">Gợi ý dành cho bạn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};
