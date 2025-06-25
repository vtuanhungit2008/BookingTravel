"use client";

import { deleteBookingAction } from "@/utils/action";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react"; // Hoặc bạn dùng react-icons tùy chọn

export function DeleteBooking({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteBookingAction({ bookingId });

      if (result?.message) {
        toast.success("Đang xử lý hoàn tiền...");
      } else {
        toast.error("❌ Xoá thất bại");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className=" text-red-600 hover:text-red-800 transition disabled:opacity-50"
      title="Xoá đặt phòng"
    >
      <Trash2 className="ml-4" size={18} />
    </button>
  );
}
