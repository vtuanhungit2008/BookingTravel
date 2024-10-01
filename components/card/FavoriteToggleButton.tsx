import { auth } from '@clerk/nextjs/server';
import { CardSignInButton } from '../form/buttonsignin';
import { fetchFavoriteId } from '@/utils/action';
import FavoriteToggleForm from './FavoriteToggleForm';

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ propertyId });

  return <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />;
}
export default FavoriteToggleButton;