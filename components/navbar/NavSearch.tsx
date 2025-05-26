'use client';

import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';
import Image from 'next/image';

interface Suggestion {
  id: string;
  name: string;
  image: string;
}

function NavSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = useDebouncedCallback(async (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('search', value);
      const res = await fetch(`/api/search?query=${value}`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } else {
      params.delete('search');
      setSuggestions([]);
      setShowSuggestions(false);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    setSearch(currentSearch);
  }, [searchParams]);

  return (
    <div className="relative w-full max-w-xl">
      <Input
        type="search"
        placeholder="Find a property..."
        className="dark:bg-muted"
        value={search}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          handleSearch(value);
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white shadow border rounded text-sm max-h-64 overflow-auto">
          {suggestions.map((item) => (
            <li key={item.id}>
              <Link
                href={`/properties/${item.id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-md shrink-0" 
                />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NavSearch;
