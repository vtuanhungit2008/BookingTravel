import Image from 'next/image';
import Link from 'next/link';
import { PropertyCardProps } from '@/utils/types';
import { formatCurrency } from '@/utils/format';
import PropertyRating from './PropertyRating';
import FavoriteToggleButton from './FavoriteToggleButton';
import CountryFlagAndName from './CountryFlagAndName';

export default function PropertyCard({ property }: { property: PropertyCardProps }) {
  const { id, name, image, price, tagline, country } = property;

  return (
    <article className="group relative">
      <Link href={`/properties/${id}`} className="block">
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1 truncate">{name}</h3>
          <PropertyRating inPage={false} propertyId={id} />
        </div>

        <p className="text-sm mt-1 text-muted-foreground truncate">
          {tagline || 'Chưa có mô tả'}
        </p>

        <div className="flex justify-between items-center mt-1">
          <p className="text-sm">
            <span className="font-semibold">{formatCurrency(price)}</span> / night
          </p>
          <CountryFlagAndName countryCode={country} />
        </div>
      </Link>

      <div className="absolute top-5 right-5 z-10">
        <FavoriteToggleButton propertyId={id} />
      </div>
    </article>
  );
}
