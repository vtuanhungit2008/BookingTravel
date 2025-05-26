'use client';

import { recordPropertyView } from '@/utils/test';
import { useEffect } from 'react';


const RecordView = ({ propertyId }: { propertyId: string }) => {
  useEffect(() => {
    recordPropertyView(propertyId);
  }, [propertyId]);

  return null;
};

export default RecordView;
