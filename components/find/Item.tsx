import React from "react";

interface Hotel {
  id: string;
  name: string;
  tagline: string;
  country: string;
  image: string;
  price: number;
}

interface RecommendationsProps {
  selectedHotel: Hotel;
  hotels: Hotel[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ selectedHotel, hotels }) => {
  // Gợi ý các khách sạn cùng quốc gia, giá ±20$, và không phải chính nó
  const recommendHotels = hotels.filter(
    (hotel) =>
      hotel.id !== selectedHotel.id &&
      hotel.country === selectedHotel.country &&
      hotel.price >= selectedHotel.price - 20 &&
      hotel.price <= selectedHotel.price + 20
  );

  if (recommendHotels.length === 0) {
    return <p>Không có khách sạn nào phù hợp để gợi ý.</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Gợi ý khách sạn tương tự:</h2>
      <div className="hotel-list">
        {recommendHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <img src={hotel.image} alt={hotel.name} />
            <h3>{hotel.name}</h3>
            <p>{hotel.tagline}</p>
            <p>Giá: {hotel.price}$</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
