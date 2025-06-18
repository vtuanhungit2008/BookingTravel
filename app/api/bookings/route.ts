// app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            name: true,
            country: true,
            image: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            email: true,
            profileImage: true,
          },
        },
        guest: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      property: {
        name: b.property.name,
        country: b.property.country,
        image: b.property.image || '',
      },
      guest: b.guest
        ? {
            fullName: b.guest.fullName || 'Khách vãng lai',
            email: b.guest.email || '',
            phone: b.guest.phone || '',
          }
        : undefined,
      profile: b.profile
        ? {
            firstName: b.profile.firstName,
            email: b.profile.email,
            profileImage: b.profile.profileImage || '',
          }
        : undefined,
      orderTotal: b.orderTotal,
      discount: b.discount || 0,
      finalPaid: b.finalPaid ?? null,
      totalNights: b.totalNights,
      roomType: b.roomType || '',
      checkIn: b.checkIn.toISOString(), // 💡 ISO string
      checkOut: b.checkOut.toISOString(),
      checkInFormatted: new Date(b.checkIn).toLocaleDateString('vi-VN'),
      checkOutFormatted: new Date(b.checkOut).toLocaleDateString('vi-VN'),
      paymentStatus: b.paymentStatus,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('[BOOKINGS_GET_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
