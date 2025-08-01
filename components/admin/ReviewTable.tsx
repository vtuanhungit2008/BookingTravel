// app/admin/dashboard/reviews/ReviewTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Star, Loader2 } from "lucide-react";

interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  property: {
    name: string;
  };
}

export function ReviewTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Review | null>(null);
  const [formData, setFormData] = useState({ comment: "", rating: 1 });

  useEffect(() => {
    fetchReviews();
  }, [search]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch("/api/reviews");
    const data = await res.json();
    const filtered = data.filter((r: Review) =>
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.property.name.toLowerCase().includes(search.toLowerCase())
    );
    setReviews(filtered);
    setLoading(false);
  };

  const openModal = (review: Review) => {
    setEditing(review);
    setFormData({ comment: review.comment, rating: review.rating });
  };

  const closeModal = () => setEditing(null);

  const handleSave = async () => {
    if (!editing) return;
    if (formData.rating < 1 || formData.rating > 5) {
      alert("Rating phải từ 1 đến 5");
      return;
    }
    await fetch(`/api/reviews/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    closeModal();
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá đánh giá này?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">⭐ Danh sách đánh giá</h2>
        <input
          type="text"
          placeholder="Tìm theo bình luận hoặc chỗ ở..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md text-sm shadow-sm w-64"
        />
      </div>

      {loading ? (
        <div className="flex items-center text-gray-500 gap-2">
          <Loader2 className="animate-spin w-4 h-4" /> Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
              <tr>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Chỗ ở</th>
                <th className="px-4 py-3">Số sao</th>
                <th className="px-4 py-3">Bình luận</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{r.profile.firstName} {r.profile.lastName}</td>
                  <td className="px-4 py-3">{r.property.name}</td>
                  <td className="px-4 py-3 flex gap-1 text-yellow-500">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate" title={r.comment}>{r.comment}</td>
                  <td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button onClick={() => openModal(r)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium">
                      <Pencil className="w-4 h-4" /> Sửa
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium">
                      <Trash2 className="w-4 h-4" /> Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400 italic">Không có đánh giá nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Sửa đánh giá</h3>
            <div className="space-y-3">
              <input
                type="number"
                min={1}
                max={5}
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="Số sao (1-5)"
              />
              <textarea
                rows={3}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="Bình luận"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">
                Huỷ
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}