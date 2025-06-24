'use client'

import { Input } from '../ui/input'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Link from 'next/link'
import Image from 'next/image'
import { getProvinces } from 'vn-provinces'
import { FaSearch } from 'react-icons/fa'

interface Suggestion {
  id: string
  name: string
  image: string
}

const LOCATIONS = getProvinces()

function NavSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const fetchSuggestions = async (
    query: string,
    selectedLocation: string,
    selectedPrice: string
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    if (query.trim()) params.set('search', query)
    else params.delete('search')

    if (selectedLocation.trim()) params.set('location', selectedLocation)
    else params.delete('location')

    if (selectedPrice.trim()) params.set('priceRange', selectedPrice)
    else params.delete('priceRange')

    if (query && selectedLocation) {
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const debouncedSearch = useDebouncedCallback((value: string) => {
    fetchSuggestions(value, location, priceRange)
  }, 300)

  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    const currentLocation = searchParams.get('location') || ''
    const currentPrice = searchParams.get('priceRange') || ''

    setSearch(currentSearch)
    setLocation(currentLocation)
    setPriceRange(currentPrice)
  }, [searchParams])

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 py-2 gap-3 hover:shadow-md transition">
      {/* Location dropdown */}
      <select
        value={location}
        onChange={(e) => {
          const loc = e.target.value
          setLocation(loc)
          fetchSuggestions(search, loc, priceRange)
        }}
        className="bg-transparent text-sm text-gray-700 focus:outline-none"
      >
        <option value="">Tất cả địa điểm</option>
        {LOCATIONS.map((prov) => (
          <option key={prov.code} value={prov.name}>
            {prov.name}
          </option>
        ))}
      </select>

      {/* Price range */}
      <select
        value={priceRange}
        onChange={(e) => {
          const price = e.target.value
          setPriceRange(price)
          fetchSuggestions(search, location, price)
        }}
        className="bg-transparent text-sm text-gray-700 focus:outline-none"
      >
        <option value="">Mức giá</option>
        <option value="0-500000">Dưới 500K</option>
        <option value="500000-1000000">500K - 1 triệu</option>
        <option value="1000000-2000000">1 - 2 triệu</option>
        <option value="2000000-99999999">Trên 2 triệu</option>
      </select>

      <span className="h-6 w-px bg-gray-200" />

      {/* Search input */}
      <div className="flex-1 relative">
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            const value = e.target.value
            setSearch(value)
            debouncedSearch(value)
          }}
          placeholder="Tìm khách sạn, villa, homestay..."
          className="w-full border-none focus:ring-0 focus:outline-none text-sm bg-transparent"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FaSearch />
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-full bg-white border shadow rounded-md text-sm z-50 max-h-64 overflow-auto">
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
  )
}

export default NavSearch
