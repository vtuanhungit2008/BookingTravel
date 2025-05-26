'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  country: string;
  price: number;
}

export function PropertyTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Omit<Property, 'id'>>({
    name: '',
    country: '',
    price: 0,
  });

  const fetchProperties = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    const res = await fetch(`/api/properties?${params.toString()}`);
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [search]);

  const openModal = (property: Property) => {
    setEditing(property);
    setFormData({
      name: property.name,
      country: property.country,
      price: property.price,
    });
  };

  const closeModal = () => {
    setEditing(null);
  };

  const handleSave = async () => {
    if (!editing) return;

    await fetch(`/api/properties/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    closeModal();
    fetchProperties();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá chỗ ở này?')) return;
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    fetchProperties();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">🏠 Danh sách chỗ ở</h2>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Tìm kiếm tên hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md text-sm w-full sm:w-64 shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 italic">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Quốc gia</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.country}</td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => openModal(p)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      <Pencil className="w-4 h-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                    Không tìm thấy kết quả.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal sửa chỗ ở */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Sửa chỗ ở</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tên chỗ ở"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Quốc gia"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="Giá"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
