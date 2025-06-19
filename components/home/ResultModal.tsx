// components/ResultModal.tsx
"use client"

export default function ResultModal({
  result,
  voucher,
  onClose,
}: {
  result: string
  voucher?: any
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-300 p-6 max-w-sm w-full text-center animate-scaleIn relative">
        <div className="text-5xl mb-3 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-green-600">Chúc mừng!</h2>
        <p className="text-lg mt-2 text-gray-800">Bạn đã trúng:</p>
        <p className="text-2xl font-bold text-blue-700 mt-2">{result}</p>

        {voucher && (
          <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg shadow">
            <p><strong>Mã:</strong> <span className="text-green-600">{voucher.code}</span></p>
            <p><strong>Giảm:</strong> {voucher.discount}{voucher.type === "PERCENT" ? "%" : "đ"}</p>
            <p><strong>HSD:</strong> {new Date(voucher.expiresAt).toLocaleDateString()}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
