'use client';

import { useState, useRef } from 'react';
import PropertyCard from '../card/PropertyCard';
import type { PropertyCardProps } from '@/utils/types';

export default function PropertiesList({ properties }: { properties: PropertyCardProps[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = properties.slice(startIndex, startIndex + itemsPerPage);

  const handleMouseEnter = (id: string) => {
    hoverTimer.current = setTimeout(() => {
      setHoveredId(id);
    }, 1000); // ⏱️ Hover 2 giây
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
  };

  return (
    <section className="mt-10 px-4 md:px-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((property) => (
          <div
            key={property.id}
            onMouseEnter={() => handleMouseEnter(property.id)}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-all duration-500 ${
              hoveredId && hoveredId !== property.id ? 'blur-sm opacity-40 scale-[0.97]' : ''
            }`}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
          >
            Trang trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === i + 1
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white border hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
          >
            Trang sau 
          </button>
        </div>
      )}
    </section>
  );
}
