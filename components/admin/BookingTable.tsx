"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { format, parseISO } from "date-fns";

interface Booking {
  id: string;
  property: {
    name: string;
    country: string;
    image: string;
  };
  guest?: {
    fullName: string;
    email: string;
    phone: string;
  };
  profile?: {
    firstName: string;
    email: string;
    profileImage: string;
  };
  orderTotal: number;
  discount: number;
  finalPaid?: number | null;
  totalNights: number;
  roomType: string;
  checkIn: string;
  checkOut: string;
  checkInFormatted: string;
  checkOutFormatted: string;
  paymentStatus: boolean;
}

interface EditForm {
  id: string;
  checkIn: string;
  checkOut: string;
  paymentStatus: boolean;
}

export function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn đặt phòng này?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Xóa thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa!");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      const res = await fetch(`/api/bookings/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        fetchBookings();
        setEditForm(null);
      } else {
        alert("Cập nhật thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📅 Danh sách đặt phòng</h2>

      {loading ? (
        <div className="flex items-center text-gray-500 gap-2">
          <Loader2 className="animate-spin w-4 h-4" /> Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
              <tr>
                <th className="px-4 py-3">Chỗ ở</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Số đêm</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{b.property.name}</div>
                    <div className="text-xs text-gray-500">{b.property.country}</div>
                  </td>
                  <td className="px-4 py-3">
                    {b.profile ? (
                      <>
                        <div>{b.profile.firstName}</div>
                        <div className="text-xs text-gray-500">{b.profile.email}</div>
                      </>
                    ) : (
                      <>
                        <div>{b.guest?.fullName}</div>
                        <div className="text-xs text-gray-500">{b.guest?.email}</div>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>{b.checkInFormatted}</div>
                    <div className="text-xs text-gray-500">→ {b.checkOutFormatted}</div>
                  </td>
                  <td className="px-4 py-3">{b.totalNights}</td>
                  <td className="px-4 py-3">
                    <div>{(b.finalPaid ?? b.orderTotal - b.discount).toFixed(2)}$</div>
                    <div className={`text-xs font-medium ${b.paymentStatus ? 'text-green-600' : 'text-red-600'}`}>
                      {b.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        setEditForm({
                          id: b.id,
                          checkIn: format(parseISO(b.checkIn), "yyyy-MM-dd"),
                          checkOut: format(parseISO(b.checkOut), "yyyy-MM-dd"),
                          paymentStatus: b.paymentStatus,
                        })
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(b.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400 italic">
                    Không có đơn đặt nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal sửa */}
      <Dialog open={!!editForm} onClose={() => setEditForm(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">✏️ Sửa đặt phòng</Dialog.Title>

            {editForm && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Ngày nhận phòng</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border px-2 py-1 rounded"
                    value={editForm.checkIn}
                    onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Ngày trả phòng</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border px-2 py-1 rounded"
                    value={editForm.checkOut}
                    onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.paymentStatus}
                    onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.checked })}
                  />
                  <label className="text-sm">Đã thanh toán</label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="text-gray-600 hover:underline"
                    onClick={() => setEditForm(null)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
