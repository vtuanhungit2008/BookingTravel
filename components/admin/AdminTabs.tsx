"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserTable } from "./UserTable";
import { PropertyTable } from "./PropertyTable";
import { ReviewTable } from "./ReviewTable";
import { BookingTable } from "./BookingTable";
import { VoucherTable } from "./VoucherTable";
import AnalyticsDashboard from "./AnalyticsDashboard";


export default function AdminTabs() {
  return (
    <Tabs defaultValue="users" className="w-full mt-8">
      <TabsList className="bg-zinc-900 p-1 rounded-xl flex flex-wrap gap-2 border border-zinc-700 justify-center">  
        <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2 rounded-lg text-sm transition">Người dùng</TabsTrigger>
        <TabsTrigger value="properties" className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2 rounded-lg text-sm transition">Chỗ ở</TabsTrigger>
        <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2 rounded-lg text-sm transition">Đánh giá</TabsTrigger>
        <TabsTrigger value="bookings" className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2 rounded-lg text-sm transition">Đặt phòng</TabsTrigger>
        <TabsTrigger value="vouchers" className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2 rounded-lg text-sm transition">Mã giảm giá</TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2 rounded-lg text-sm transition">Phân tích</TabsTrigger>
      </TabsList>

      <div className="mt-8">
        <TabsContent value="users">
          <UserTable />
        </TabsContent>
        <TabsContent value="properties">
          <PropertyTable />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewTable />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingTable />
        </TabsContent>
         <TabsContent value="vouchers">
          <VoucherTable />
        </TabsContent>
         <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent> 
      
      </div>
    </Tabs>
  );
}