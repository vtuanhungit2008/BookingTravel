'use client';

import { useEffect, useState } from 'react';
import FavoriteToggleForm from './FavoriteToggleForm';

export default function FavoriteToggleButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorite = async () => {
      const res = await fetch(`/api/favorite?propertyId=${propertyId}`);
      const json = await res.json();
      setFavoriteId(json.favoriteId);
      setLoading(false);
    };
    fetchFavorite();
  }, [propertyId]);

  if (loading) return null;

  return <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />;
}
