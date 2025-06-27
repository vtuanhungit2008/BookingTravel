// PropertiesContainer.tsx
'use client';

import { useEffect } from 'react';

import { PropertyCardProps } from '@/utils/types';
import PropertiesList from './PropertiesList';
import EmptyList from './EmptyList';
import { usePropertyStore } from '@/utils/store';

export default function PropertiesContainer({
  properties,
}: {
  properties: PropertyCardProps[];
}) {
  const { setProperties, properties: stored } = usePropertyStore();
  
  useEffect(() => {
    setProperties(properties);
  }, [properties, setProperties]);

  if (!stored || stored.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }

  return <PropertiesList properties={stored} />;
}
