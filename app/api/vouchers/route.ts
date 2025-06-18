// app/api/vouchers/route.ts
import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  try {
    const vouchers = await db.voucher.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(vouchers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load vouchers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discount, type, expiresAt } = body;

    const created = await db.voucher.create({
      data: {
        code,
        discount,
        type,
        expiresAt: new Date(expiresAt),
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
  }
}
