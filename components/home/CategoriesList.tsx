import { categories } from '@/utils/categories';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import Link from 'next/link';

function CategoriesList({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const searchTerm = search ? `&search=${search}` : '';
  return (
    <section>
      <ScrollArea className="py-3 sm:ml-10 md:ml-9">
        <div className="flex gap-x-4 sm:gap-x-5 md:gap-x-3 overflow-x-auto">
          {categories.map((item) => {
            const isActive = item.label === category;
            return (
              <Link
                key={item.label}
                href={`/?category=${item.label}${searchTerm}`}
              >
                <article
                  className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[80px] sm:w-[100px] md:w-[120px] ${isActive ? 'text-primary' : ''}`}
                >
                  <item.icon className="w-4  h-4 sm:w-8 sm:h-8 md:w-8 md:h-10" />
                  <p className="capitalize text-xs sm:text-sm md:text-base mt-1">{item.label}</p>
                </article>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default CategoriesList;
