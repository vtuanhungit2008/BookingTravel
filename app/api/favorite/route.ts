import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  const { userId } = auth();

  if (!userId || !propertyId) {
    return NextResponse.json({ favoriteId: null });
  }

  const favorite = await db.favorite.findFirst({
    where: {
      profileId: userId,
      propertyId,
    },
    select: { id: true },
  });

  return NextResponse.json({ favoriteId: favorite?.id ?? null });
}
