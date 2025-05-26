'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;
const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
);
const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
      'data-[state=active]:bg-background data-[state=active]:text-foreground',
      'data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
);
const TabsContent = TabsPrimitive.Content;

export { Tabs, TabsList, TabsTrigger, TabsContent };
