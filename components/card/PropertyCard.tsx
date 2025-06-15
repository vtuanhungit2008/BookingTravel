'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropertyCardProps } from '@/utils/types'
import { formatCurrency } from '@/utils/format'
import PropertyRating from './PropertyRating'
import FavoriteToggleButton from './FavoriteToggleButton'
import CountryFlagAndName from './CountryFlagAndName'

export default function PropertyCard({ property }: { property: PropertyCardProps }) {
  const {
    id,
    name,
    image,
    price,
    tagline,
    country,
    favoriteId,
    rating,
    reviewCount,
  } = property

  return (
    <article className="group relative rounded-3xl overflow-hidden shadow hover:shadow-xl transition duration-300 bg-white">
      <Link href={`/properties/${id}`} className="block">
        {/* Image with hover zoom */}
        <div className="relative h-[240px] md:h-[260px] lg:h-[220px] xl:h-[240px] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent p-3">
            <h3 className="text-white text-base font-semibold truncate drop-shadow">{name}</h3>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-2">
          <p className="text-sm text-gray-500 italic truncate">
            {tagline || 'Không gian lý tưởng cho kỳ nghỉ của bạn'}
          </p>

          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-800">
              {formatCurrency(price)} <span className="text-gray-400 font-normal">/ đêm</span>
            </span>
            <CountryFlagAndName countryCode={country} />
          </div>

          <div className="flex justify-between items-center">
            <PropertyRating inPage={false} rating={rating} count={reviewCount ?? 0} />
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteToggleButton propertyId={id} initialFavoriteId={favoriteId ?? null} />
      </div>
    </article>
  )
}
