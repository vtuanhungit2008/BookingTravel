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
      try {
        const res = await fetch(`/api/favorite?propertyId=${propertyId}`);
        const json = await res.json();
        setFavoriteId(json.favoriteId || null);
      } catch (err) {
        console.error('Error fetching favorite:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorite();
  }, [propertyId]);

  if (loading) return null;

  return (
    <FavoriteToggleForm
      propertyId={propertyId}
      favoriteId={favoriteId}
      onChange={(newId) => setFavoriteId(newId)}
    />
  );
}
