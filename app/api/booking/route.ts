import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import { formatDate } from '@/utils/format';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get('id');

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });
  }

  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          select: {
            name: true,
            image: true,
            country: true,
          },
        },
        guest: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Ưu tiên lấy thông tin từ profile, nếu không có thì dùng guest
    const customer = booking.profile
      ? {
          fullName: booking.profile.firstName,
          email: booking.profile.email,
          phone: '', // bạn có thể thêm phone nếu lưu trong profile
        }
      : booking.guest;

    // Giả định giảm giá $20
    const originalTotal = booking.orderTotal + 20;
    const discount = 20;

    return NextResponse.json({
      id: booking.id,
      property: booking.property,
      guest: customer ?? null,
      orderTotal: booking.orderTotal,
      originalTotal,
      discount,
      totalNights: booking.totalNights,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      checkInFormatted: formatDate(booking.checkIn),
      checkOutFormatted: formatDate(booking.checkOut),
      roomType: booking.roomType,
      paymentStatus: booking.paymentStatus,
    });
  } catch (error) {
    console.error('[BOOKING_INFO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch booking info' }, { status: 500 });
  }
}
