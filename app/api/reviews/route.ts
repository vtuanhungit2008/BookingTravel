import prisma from '@/utils/db';
import { NextResponse } from 'next/server';


export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      profile: true,
      property: true,
    },
  });
  return NextResponse.json(reviews);
}
