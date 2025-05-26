import EmptyList from '@/components/home/EmptyList';
import PropertiesList from '@/components/home/PropertiesList';
import { fetchFavorites } from '@/utils/action';

export const metadata = {
  title: 'Your Favorite Properties | HomeAway',
};

export default async function FavoritesPage() {
  const favorites = await fetchFavorites();

  return (
    <section className="min-h-screen  py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
      <h1 className="mb-10 text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
               
                  Your Favorite Stays
              </h1>

        {favorites.length === 0 ? (
          <div className="flex justify-center items-center">
            <EmptyList />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <PropertiesList properties={favorites} />
          </div>
        )}
      </div>
    </section>
  );
}
