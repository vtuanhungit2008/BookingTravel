import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.trim() || '';
  const location = searchParams.get('location')?.trim() || '';

  if (!query || !location) return NextResponse.json([]);

  const results = await db.property.findMany({
    where: {
      AND: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          country: {
            contains: location,
            mode: 'insensitive',
          },
        },
      ],
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
