// app/api/bookings/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.booking.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[BOOKING_DELETE_ERROR]', err);
    return NextResponse.json({ error: 'Xoá thất bại' }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { checkIn, checkOut, paymentStatus } = body;

    const updated = await db.booking.update({
      where: { id: params.id },
      data: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        paymentStatus,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[BOOKING_UPDATE_ERROR]', err);
    return NextResponse.json({ error: 'Cập nhật thất bại' }, { status: 500 });
  }
}