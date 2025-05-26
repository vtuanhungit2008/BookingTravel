import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  if (!query) return NextResponse.json([]);

  const results = await db.property.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: 5,
  });

  return NextResponse.json(results);
}
