import { fetchFavoriteId, fetchProperties } from '@/utils/action';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import CategoriesList from '@/components/home/CategoriesList';
import LandingHero from '@/components/home/LandingHero';

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    search?: string;
    location?: string;
  };
}) {
  
  const hasSearch = !!searchParams.category || !!searchParams.search || !!searchParams.location;
  const properties = await fetchProperties(searchParams);


  
  return (
    <section className="w-full pb-8">
      {!hasSearch && <LandingHero />}
      <CategoriesList {...searchParams} />
      <PropertiesContainer properties={properties} />
    </section>
  );
}
