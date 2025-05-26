'use client';

import { useFormState } from 'react-dom';
import { toggleFavoriteAction } from '@/utils/action';
import { CardSubmitButton } from '../form/cardsubmitbutton';

type Props = {
  propertyId: string;
  favoriteId: string | null;
};

export default function FavoriteToggleForm({ propertyId, favoriteId }: Props) {
  const [state, formAction] = useFormState(toggleFavoriteAction, {
    favoriteId,
  });

  const newFavoriteId = state?.favoriteId ?? null;

  return (
    <form action={formAction}>
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="favoriteId" value={newFavoriteId ?? ''} />
      <CardSubmitButton isFavorite={!!newFavoriteId} />
    </form>
  );
}
