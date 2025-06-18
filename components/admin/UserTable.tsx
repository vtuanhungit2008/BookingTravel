// app/admin/dashboard/users/UserTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Loader2, Search } from "lucide-react";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function UserTable() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState<Omit<Profile, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  const fetchProfiles = async () => {
    setLoading(true);
    const res = await fetch("/api/profiles");
    const data = await res.json();
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const openEditModal = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
  };

  const closeModal = () => {
    setEditingUser(null);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    await fetch(`/api/profiles/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    closeModal();
    fetchProfiles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    fetchProfiles();
  };

  const filteredProfiles = profiles.filter((p) => {
    const keyword = query.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(keyword) ||
      p.lastName.toLowerCase().includes(keyword) ||
      p.email.toLowerCase().includes(keyword) ||
      p.username.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl ml-2 font-bold text-gray-800">Danh sách người dùng</h2>
        <div className="relative">
          <Search className="absolute w-4 h-4 left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
              <tr>
                <th className="px-4 py-3">Họ & Tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.firstName} {p.lastName}</td>
                  <td className="px-4 py-3">{p.email}</td>
                  <td className="px-4 py-3">{p.username}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(p)}
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
              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal sửa user */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Sửa người dùng</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Tên"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Họ"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
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
