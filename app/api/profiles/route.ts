import prisma from '@/utils/db';
import { NextResponse } from 'next/server';


export async function GET() {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(profiles);
}
