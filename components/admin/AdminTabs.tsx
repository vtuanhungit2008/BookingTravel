"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { UserTable } from "./UserTable";
import { PropertyTable } from "./PropertyTable";
import { ReviewTable } from "./ReviewTable";


export default function AdminTabs() {
  return (
    <Tabs defaultValue="profiles" className="w-full mt-6">
      <TabsList className="flex gap-2 overflow-x-auto">
        <TabsTrigger value="users">Người dùng</TabsTrigger>
        
        <TabsTrigger value="properties">Chỗ ở</TabsTrigger>
        <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
      </TabsList>

     
      <TabsContent value="users">
        <UserTable />
      </TabsContent>
      <TabsContent value="properties">
        <PropertyTable />
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewTable />
      </TabsContent>
    </Tabs>
  );
}
