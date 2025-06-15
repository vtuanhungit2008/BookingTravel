'use client';

import { useState } from 'react';
import { toggleFavoriteAction } from '@/utils/action';
import { Heart } from 'lucide-react'; // Giả sử bạn dùng `lucide-react`, nếu không có `HeartFilled` thì xem dòng dưới

export default function FavoriteToggleButton({
  propertyId,
  initialFavoriteId,
}: {
  propertyId: string;
  initialFavoriteId: string | null;
}) {
  const [favoriteId, setFavoriteId] = useState<string | null>(initialFavoriteId);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('propertyId', propertyId);
    if (favoriteId) formData.append('favoriteId', favoriteId);

    const result = await toggleFavoriteAction(null, formData);
    setFavoriteId(result.favoriteId);
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="transition-transform duration-200 hover:scale-110"
      aria-label="Toggle Favorite"
    >
      {favoriteId ? (
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
      ) : (
        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
      )}
    </button>
  );
}
