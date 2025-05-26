'use client'
import React, { useEffect, useState } from "react";

type Property = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  price: number;
  description: string;
};

type Recommendation = {
  id: string;
  profileId: string;
  propertyId: string;
  property: Property;
};

export default function RecommendationList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API từ route bạn đã tạo
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/recommendations");
        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <p>Loading recommendations...</p>;

  if (recommendations.length === 0) return <p>No recommendations found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl"
        >
          <img
            src={rec.property.image}
            alt={rec.property.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold">{rec.property.name}</h3>
            <p className="text-sm text-gray-500">{rec.property.tagline}</p>
            <p className="mt-2 text-gray-700 line-clamp-3">
              {rec.property.description}
            </p>
            <p className="mt-2 font-bold text-blue-600">${rec.property.price}/night</p>
          </div>
        </div>
      ))}
    </div>
  );
}
