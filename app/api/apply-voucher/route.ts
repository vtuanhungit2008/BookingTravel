import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('💡 BODY:', body); // DEBUG

    const code = body.code;
    if (!code) {
      return NextResponse.json({ error: 'Missing voucher code' }, { status: 400 });
    }

    const voucher = await db.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }

    const isExpired = new Date(voucher.expiresAt) < new Date();
    if (isExpired) {
      return NextResponse.json({ error: 'Voucher expired' }, { status: 400 });
    }

    return NextResponse.json({
      code: voucher.code,
      discount: voucher.discount,
      type: voucher.type,
    });
  } catch (error) {
    console.error('[💥 APPLY_VOUCHER_ERROR]', error); // DEBUG
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
