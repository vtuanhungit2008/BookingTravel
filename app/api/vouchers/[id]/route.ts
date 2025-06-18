// app/api/vouchers/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, discount, type, expiresAt } = await req.json();

    const updated = await db.voucher.update({
      where: { id: params.id },
      data: {
        code: name,
        discount,
        type,
        expiresAt: new Date(expiresAt),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.voucher.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete voucher' }, { status: 500 });
  }
}
