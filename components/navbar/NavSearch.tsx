'use client'

import { Input } from '../ui/input'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { getProvinces } from 'vn-provinces'
import { FaSearch } from 'react-icons/fa'

const LOCATIONS = getProvinces()

function NavSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState('')

  // Cập nhật URL từ state
  const updateUrl = useCallback((query: string, selectedLocation: string, selectedPrice: string) => {
    const params = new URLSearchParams()

    if (query.trim()) params.set('search', query)
    if (selectedLocation.trim()) params.set('location', selectedLocation)
    if (selectedPrice.trim()) params.set('priceRange', selectedPrice)

    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router])

  // Gọi update URL theo debounce
  const debouncedUpdate = useDebouncedCallback((value: string) => {
    updateUrl(value, location, priceRange)
  }, 300)

  // Lấy giá trị ban đầu từ URL khi load lần đầu
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    const currentLocation = searchParams.get('location') || ''
    const currentPrice = searchParams.get('priceRange') || ''

    setSearch(currentSearch)
    setLocation(currentLocation)
    setPriceRange(currentPrice)
    // chỉ chạy 1 lần khi mounted
  }, []) // ← không dùng [searchParams] nữa

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 py-2 gap-3 hover:shadow-md transition">
      {/* Location dropdown */}
      <select
        value={location}
        onChange={(e) => {
          const loc = e.target.value
          setLocation(loc)
          updateUrl(search, loc, priceRange)
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

      {/* Price range dropdown */}
      <select
        value={priceRange}
        onChange={(e) => {
          const price = e.target.value
          setPriceRange(price)
          updateUrl(search, location, price)
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
            debouncedUpdate(value)
          }}
          placeholder="Tìm khách sạn, villa, homestay..."
          className="w-full border-none focus:ring-0 focus:outline-none text-sm bg-transparent"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FaSearch />
        </div>
      </div>
    </div>
  )
}

export default NavSearch
