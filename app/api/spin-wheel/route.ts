import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { startOfDay, endOfDay } from "date-fns"
import prisma from "@/utils/db"
import { VoucherType } from "@prisma/client"

const prizes = [
    { label: "Không trúng", chance: 15, voucher: null},
  { label: "Voucher 5%", chance: 25, voucher: { type: VoucherType.PERCENT, discount: 5 } },
  { label: "Voucher 10%", chance: 20, voucher: { type: VoucherType.PERCENT, discount: 10 } },
  { label: "Giảm 100K", chance: 40, voucher: { type: VoucherType.FIXED, discount: 100000 } },
  { label: "Miễn phí 1 đêm", chance: 5, voucher: { type: VoucherType.PERCENT, discount: 100 } },
]

function spinPrize() {
  const rand = Math.random() * 100
  let cumulative = 0
  for (const prize of prizes) {
    cumulative += prize.chance
    if (rand <= cumulative) return prize
  }
  return prizes[0]
}

export async function POST() {
  const { userId: clerkId } = auth()
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // ✅ Tìm đúng Profile bằng Clerk ID
    const profile = await prisma.profile.findUnique({
      where: { clerkId },
    })

    if (!profile) {
      return NextResponse.json({ error: "Không tìm thấy hồ sơ người dùng" }, { status: 404 })
    }

    const today = new Date()
    const alreadySpun = await prisma.spinHistory.findFirst({
      where: {
        profileId: profile.clerkId, // dùng clerkId vì spinHistory liên kết bằng clerkId
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    })

    if (alreadySpun) {
      return NextResponse.json(
        { message: "Bạn đã quay hôm nay rồi", result: alreadySpun.reward },
        { status: 400 }
      )
    }

    const prize = spinPrize()
    let voucher = null

    if (prize.voucher) {
      const code = `SPIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      voucher = await prisma.voucher.create({
        data: {
          code,
          discount: prize.voucher.discount,
          type: prize.voucher.type,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          owners: {
            connect: { id: profile.id }, // ✅ đúng kiểu UUID
          },
        },
      })
    }

    await prisma.spinHistory.create({
      data: {
        profileId: profile.clerkId, // spinHistory vẫn gán theo clerkId
        reward: prize.label,
      },
    })

    return NextResponse.json({
      message: "Quay thành công!",
      result: prize.label,
      voucher,
    })
  } catch (error) {
    console.error("Spin API error:", error)
    return NextResponse.json({ error: "Lỗi hệ thống. Vui lòng thử lại." }, { status: 500 })
  }
}
