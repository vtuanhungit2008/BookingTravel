import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import prisma from '@/utils/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || '';

  try {
    const properties = await db.property.findMany({
      where: {
        AND: [
          category ? { category } : {},
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { tagline: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        country: true,
        image: true,
        price: true,
      },
    });

    return NextResponse.json(properties);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
