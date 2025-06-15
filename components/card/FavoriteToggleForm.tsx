'use client';

import { toggleFavoriteAction } from '@/utils/action';
import { CardSubmitButton } from '../form/cardsubmitbutton';

type Props = {
  propertyId: string;
  favoriteId: string | null;
  onChange: (newFavoriteId: string | null) => void;
};

export default function FavoriteToggleForm({
  propertyId,
  favoriteId,
  onChange,
}: Props) {
  const handleSubmit = async (formData: FormData) => {
    const result = await toggleFavoriteAction(null, formData);
    onChange(result.favoriteId ?? null);
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="favoriteId" value={favoriteId ?? ''} />
      <CardSubmitButton isFavorite={!!favoriteId} />
    </form>
  );
}
