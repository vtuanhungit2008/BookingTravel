import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { comment, rating } = await req.json();
  const updated = await prisma.review.update({
    where: { id: params.id },
    data: { comment, rating },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Deleted' });
}
