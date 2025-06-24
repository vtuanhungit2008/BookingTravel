"use client"

import { useState } from "react"
import { Wheel } from "react-custom-roulette"

const prizes = [
  { option: "Không trúng" },
  { option: "Voucher 5%" },
  { option: "Voucher 10%" },
  { option: "Giảm 100K" },
  { option: "Miễn phí 1 đêm" },
]

export default function SpinModal({ onClose }: { onClose: () => void }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [result, setResult] = useState("")
  const [voucher, setVoucher] = useState<any>(null)
  const [spinning, setSpinning] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [hideWheelModal, setHideWheelModal] = useState(false)

  const handleSpin = async () => {
    setSpinning(true)
    setResult("")
    setVoucher(null)
    setShowLimitModal(false)

    const res = await fetch("/api/spin-wheel", { method: "POST" })
    const data = await res.json().catch(() => null)

    if (!res.ok || !data?.result) {
      if (data?.message === "Bạn đã quay hôm nay rồi") {
        setShowLimitModal(true)
        setSpinning(false)
        return
      }
      setResult(data?.message || "Có lỗi xảy ra!")
      setSpinning(false)
      return
    }

    const index = prizes.findIndex((p) => p.option === data.result)
    setPrizeNumber(index !== -1 ? index : 0)
    setVoucher(data.voucher || null)
    setResult(data.result)

    setTimeout(() => {
      setMustSpin(true)
    }, 100)
  }

const onStopSpinning = async () => {
  setMustSpin(false)
  setSpinning(false)
  setHideWheelModal(true)

  // 👇 Hiện modal chúc mừng ngay lập tức
  setShowCongrats(true)

  // 👇 Gửi thông báo hệ thống sau (không ảnh hưởng UI)
  if (result && result !== "Không trúng") {
    try {
      await fetch("/api/announcements", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "🎁 Người dùng vừa trúng thưởng!",
    content: `Phần thưởng: ${result}${
      voucher?.code
        ? `\nMã voucher: ${voucher.code}\nGiảm: ${voucher.discount}${voucher.type === "PERCENT" ? "%" : "đ"}\nHSD: ${new Date(voucher.expiresAt).toLocaleDateString()}`
        : ""
    }`,
    type: "PROMOTION",
  }),
})
    } catch (error) {
      console.error("Gửi thông báo thất bại:", error)
      // không cần show lỗi vì không ảnh hưởng trải nghiệm người dùng
    }
  }
}
  return (
    <>
      {/* Modal quay số */}
      {!hideWheelModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center animate-fadeIn relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6"> Quay thưởng voucher </h2>
            <div className="flex justify-center">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={prizes}
                onStopSpinning={onStopSpinning}
                backgroundColors={["#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f87171"]}
                textColors={["#fff"]}
                outerBorderColor="#d1d5db"
                outerBorderWidth={6}
                innerBorderColor="#fff"
                radiusLineColor="#e5e7eb"
                radiusLineWidth={2}
                textDistance={65}
                fontSize={16}
              />
            </div>
            <button
              onClick={handleSpin}
              disabled={mustSpin || spinning}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {spinning ? "Đang quay..." : "Quay ngay "}
            </button>
          </div>
        </div>
      )}

      {/* Modal chúc mừng */}
      {showCongrats && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl px-6 py-8 max-w-sm w-full text-center animate-scaleIn relative border border-gray-200">
            <div className="text-4xl mb-2 animate-bounce">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-800">Chúc mừng!</h2>
            <p className="text-gray-600 mt-2">Bạn vừa nhận được:</p>
            <p className="text-xl font-bold text-blue-600 mt-3">{result}</p>

            {voucher && (
              <div className="mt-4 text-sm text-left bg-gray-50 rounded-md px-4 py-3 border border-gray-200">
                <p><strong>Mã:</strong> <span className="text-green-700 font-medium">{voucher.code}</span></p>
                <p><strong>Giảm:</strong> {voucher.discount}{voucher.type === "PERCENT" ? "%" : "đ"}</p>
                <p><strong>HSD:</strong> {new Date(voucher.expiresAt).toLocaleDateString()}</p>
              </div>
            )}

            <button
              onClick={() => {
                setShowCongrats(false)
                onClose()
              }}
              className="mt-6 px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal hết lượt */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-md px-6 py-6 max-w-sm w-full text-center animate-scaleIn border border-gray-200">
            <div className="text-3xl mb-2">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800">Hết lượt quay hôm nay</h2>
            <p className="text-sm text-gray-600 mt-2">Bạn đã sử dụng lượt quay hôm nay. Vui lòng quay lại vào ngày mai!</p>
            <button
              onClick={() => setShowLimitModal(false)}
              className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  )
}
