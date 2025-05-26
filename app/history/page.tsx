import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/db";
import HistoryList from "@/components/history/HistoryList.client";
import { format, subDays } from "date-fns";

export default async function HistoryPage() {
  const { userId } = auth();
  if (!userId) return null;

  // Chỉ lấy dữ liệu trong 24h gần nhất
  const oneDayAgo = subDays(new Date(), 1);

  const history = await prisma.viewHistory.findMany({
    where: {
      profileId: userId,
      viewedAt: { gte: oneDayAgo }, // ✅ chỉ lấy trong 1 ngày
    },
    orderBy: { viewedAt: "desc" },
    include: { property: true },
    take: 200, // lấy dư để lọc trùng
  });

  // ✅ Lọc trùng: mỗi property chỉ hiển thị 1 lần mỗi ngày
  const uniqueMap = new Map<string, typeof history[number]>();

  for (const item of history) {
    const key = `${item.propertyId}-${format(item.viewedAt, 'yyyy-MM-dd')}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  }

  const filtered = Array.from(uniqueMap.values());

  return (
    <section className="min-h-screen py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-10 text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Your History Views (Last 24h)
        </h1>
        <div className="animate-fadeIn">
          <HistoryList history={filtered} />
        </div>
      </div>
    </section>
  );
}