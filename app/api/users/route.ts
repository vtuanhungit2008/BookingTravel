import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  const user = await currentUser();
   
    
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!user.privateMetadata.hasProfile) {
    return NextResponse.json({ error: 'NoProfile' }, { status: 403 });
  }

  return NextResponse.json({ 
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.firstName + ' ' + user.lastName,
    hasProfile: user.privateMetadata.hasProfile
  });
}
