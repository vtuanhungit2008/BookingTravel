// app/page.tsx

import CategoriesList from '@/components/home/CategoriesList';
import LandingHero from '@/components/home/LandingHero';
import Footer from '@/components/landingpage/Footer';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import { fetchProperties } from '@/utils/action';

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    search?: string;
    location?: string;
  };
}) {
  const hasSearch =
    !!searchParams?.category ||
    !!searchParams?.search ||
    !!searchParams?.location;

  const properties = await fetchProperties({
    category: searchParams.category,
    search: searchParams.search,
    location: searchParams.location,
  });

  return (
    <section className="w-full pb-8">
      {!hasSearch && <LandingHero />}

      <CategoriesList
        category={searchParams?.category}
        search={searchParams?.search}
        location={searchParams?.location}
      />


      <PropertiesContainer properties={properties} />

    </section>
  );
}
