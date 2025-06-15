'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

function BreadCrumbs({ name }: { name: string }) {
  return (
    <Breadcrumb className="text-sm text-gray-500 mb-6">
      <BreadcrumbList className="flex items-center space-x-2">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="inline-flex items-center gap-1 hover:text-black transition">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-gray-800 truncate max-w-[180px]">
            {name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbs;
