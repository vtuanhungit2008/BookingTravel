'use client';

import { useEffect } from 'react';
import { recordPropertyView } from '@/utils/test';

export default function RecordView({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    void recordPropertyView(propertyId); // Không chờ response
  }, [propertyId]);

  return null;
}
