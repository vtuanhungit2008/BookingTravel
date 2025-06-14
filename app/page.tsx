import CategoriesList from '@/components/home/CategoriesList';
import { Suspense } from 'react';
import LoadingCards from './loading';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import LandingHero from '@/components/home/LandingHero';
import Footer from '@/components/landingpage/Footer';

function HomePage({
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

  return (
    <section className="w-full pb-8">
      {!hasSearch && <LandingHero />}

      <CategoriesList
        category={searchParams?.category}
        search={searchParams?.search}
        location={searchParams?.location} // 👈 nếu cần truyền location
      />

      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParams?.category}
          search={searchParams?.search}
          location={searchParams?.location} // 👈 truyền location vào
        />
      </Suspense>

      {/* <Footer /> */}
    </section>
  );
}

export default HomePage;
