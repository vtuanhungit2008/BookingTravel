"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: "FIXED" | "PERCENT";
  expiresAt: string;
  createdAt: string;
}

interface EditForm {
  id: string;
  code: string;
  discount: number;
  type: "FIXED" | "PERCENT";
  expiresAt: string;
}

interface CreateForm {
  code: string;
  discount: number;
  type: "FIXED" | "PERCENT";
  expiresAt: string;
}

type VoucherFormType = CreateForm | EditForm;

type VoucherFormState = VoucherFormType | null;

type VoucherFormSetter = React.Dispatch<React.SetStateAction<VoucherFormState>>;

const defaultCreateForm: CreateForm = {
  code: "",
  discount: 0,
  type: "FIXED",
  expiresAt: "",
};

export function VoucherTable() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm | null>(null);

  const fetchVouchers = async () => {
    setLoading(true);
    const res = await fetch("/api/vouchers");
    const data = await res.json();
    setVouchers(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xoá voucher này?")) return;
    try {
      const res = await fetch(`/api/vouchers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVouchers((prev) => prev.filter((v) => v.id !== id));
      } else {
        alert("Xoá thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xoá.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      const res = await fetch(`/api/vouchers/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        fetchVouchers();
        setEditForm(null);
      } else {
        alert("Cập nhật thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm) return;

    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      if (res.ok) {
        fetchVouchers();
        setCreateForm(null);
      } else {
        alert("Tạo voucher thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo.");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 ml-4">Danh sách voucher</h2>
        <button
          onClick={() => setCreateForm(defaultCreateForm)}
          className="flex items-center gap-1 bg-blue-600 text-white mr-4 font-medium px-2 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <span className="text-lg">＋</span>
          <span>Thêm voucher</span>
        </button>
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
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Giảm</th>
                <th className="px-4 py-3">Hết hạn</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{v.code}</td>
                  <td className="px-4 py-3">{v.type === "PERCENT" ? "Phần trăm" : "Giảm tiền"}</td>
                  <td className="px-4 py-3">
                    {v.type === "PERCENT" ? `${v.discount}%` : `${v.discount.toLocaleString()} đ`}
                  </td>
                  <td className="px-4 py-3">{format(parseISO(v.expiresAt), "dd/MM/yyyy")}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        setEditForm({
                          id: v.id,
                          code: v.code,
                          discount: v.discount,
                          type: v.type,
                          expiresAt: format(parseISO(v.expiresAt), "yyyy-MM-dd"),
                        })
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(v.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                    Không có voucher nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Sửa */}
      <Dialog open={!!editForm} onClose={() => setEditForm(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">✏️ Chỉnh sửa voucher</Dialog.Title>
            {editForm && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <VoucherFormFields form={editForm} setForm={setEditForm as VoucherFormSetter} />
                <FormButtons onCancel={() => setEditForm(null)} submitLabel="Lưu" />
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Thêm */}
      <Dialog open={!!createForm} onClose={() => setCreateForm(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">➕ Thêm voucher</Dialog.Title>
            {createForm && (
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <VoucherFormFields form={createForm} setForm={setCreateForm as VoucherFormSetter} />
                <FormButtons onCancel={() => setCreateForm(null)} submitLabel="Tạo" />
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

function VoucherFormFields({
  form,
  setForm,
}: {
  form: VoucherFormType;
  setForm: VoucherFormSetter;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Mã voucher</label>
        <input
          type="text"
          className="mt-1 block w-full border px-2 py-1 rounded"
          value={form.code}
          onChange={(e) => setForm((prev) => prev && { ...prev, code: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Loại</label>
        <select
          className="mt-1 block w-full border px-2 py-1 rounded"
          value={form.type}
          onChange={(e) =>
            setForm((prev) => prev && { ...prev, type: e.target.value as "FIXED" | "PERCENT" })
          }
        >
          <option value="FIXED">Giảm tiền (VNĐ)</option>
          <option value="PERCENT">Phần trăm (%)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          {form.type === "PERCENT" ? "Phần trăm giảm (%)" : "Số tiền giảm (VNĐ)"}
        </label>
        <input
          type="number"
          className="mt-1 block w-full border px-2 py-1 rounded"
          value={form.discount}
          onChange={(e) => setForm((prev) => prev && { ...prev, discount: Number(e.target.value) })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Ngày hết hạn</label>
        <input
          type="date"
          className="mt-1 block w-full border px-2 py-1 rounded"
          value={form.expiresAt}
          onChange={(e) => setForm((prev) => prev && { ...prev, expiresAt: e.target.value })}
        />
      </div>
    </>
  );
}

function FormButtons({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        className="text-gray-600 hover:underline"
        onClick={onCancel}
      >
        Hủy
      </button>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </div>
  );
}
