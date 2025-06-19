"use client"
import { useState } from "react"
import SpinModal from "./Spin"
export default function FloatingSpinButton() {
  const [show, setShow] = useState(false)

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition text-2xl"
        title="Quay số may mắn"
      >
        🎲
      </button>

      {show && <SpinModal onClose={() => setShow(false)} />}
    </>
  )
}
