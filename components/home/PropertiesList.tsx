'use client';

import { useState } from 'react';
import PropertyCard from '../card/PropertyCard';
import type { PropertyCardProps } from '@/utils/types';

function PropertiesList({ properties }: { properties: PropertyCardProps[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = properties.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="mt-4">
      <div className="ml-8 mr-6 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          Trang trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === i + 1
                ? 'bg-black text-white'
                : 'border hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          Trang sau
        </button>
      </div>
    </section>
  );
}

export default PropertiesList;
