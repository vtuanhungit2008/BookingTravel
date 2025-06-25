import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔍 Tìm Profile từ Clerk ID
  const profile = await prisma.profile.findUnique({
    where: { clerkId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ người dùng" }, { status: 404 });
  }

  // ✅ Dùng profile.id (UUID) để lọc voucher
  const vouchers = await prisma.voucher.findMany({
    where: {
      owners: {
        some: { id: profile.id },
      },
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      expiresAt: "asc",
    },
  });

  return NextResponse.json({ vouchers });
}
