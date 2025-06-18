import { NextResponse } from "next/server";
import db from "@/utils/db";

export async function GET() {
  try {
    const now = new Date();

    const [
      totalVoucher,
      activeVoucher,
      expiredVoucher,
      usedVoucher,
      totalBooking,
      paidBooking,
      totalRevenue,
      totalProfile,
      totalGuest,
      topVoucher,
      topProperty,
      topUser,
    ] = await Promise.all([
      db.voucher.count(),
      db.voucher.count({ where: { expiresAt: { gt: now } } }),
      db.voucher.count({ where: { expiresAt: { lte: now } } }),
      db.booking.count({ where: { voucherId: { not: null } } }),
      db.booking.count(),
      db.booking.count({ where: { paymentStatus: true } }),
      db.booking.aggregate({ _sum: { finalPaid: true } }),
      db.profile.count(),
      db.guest.count(),
      db.booking.groupBy({
        by: ["voucherId"],
        _count: true,
        orderBy: { _count: { voucherId: "desc" } },
        take: 5,
      }),
      db.booking.groupBy({
        by: ["propertyId"],
        _count: true,
        orderBy: { _count: { propertyId: "desc" } },
        take: 5,
      }),
      db.booking.groupBy({
        by: ["profileId"],
        _count: true,
        orderBy: { _count: { profileId: "desc" } },
        where: { profileId: { not: null } },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      vouchers: {
        total: totalVoucher,
        active: activeVoucher,
        expired: expiredVoucher,
        used: usedVoucher,
        topUsed: topVoucher,
      },
      bookings: {
        total: totalBooking,
        paid: paidBooking,
        unpaid: totalBooking - paidBooking,
        revenue: totalRevenue._sum.finalPaid || 0,
        topProperties: topProperty,
      },
      users: {
        total: totalProfile,
        guests: totalGuest,
        topUsers: topUser,
      },
    });
  } catch (err) {
    console.error("[ANALYTICS_OVERVIEW_ERROR]", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
