import { getAuth } from "@clerk/nextjs/server"; // hoặc cách bạn lấy user hiện tại
import db from "@/utils/db";
import PropertiesList from "@/components/home/PropertiesList";


export default async function RecommendPage() {
  const { userId } = getAuth(); // Lấy user hiện tại

  // 1. Lấy danh sách propertyId đã thích hoặc review
  const likedIds = await db.favorite.findMany({
    where: { profileId: userId },
    select: { propertyId: true },
  });

  const reviewedIds = await db.review.findMany({
    where: { profileId: userId },
    select: { propertyId: true },
  });

  const interactedIds = [...new Set([...likedIds, ...reviewedIds].map(i => i.propertyId))];

  // 2. Tìm người dùng khác cũng thích những property đó
  const similarUsers = await db.favorite.findMany({
    where: {
      propertyId: { in: interactedIds },
      profileId: { not: userId },
    },
    select: { profileId: true },
    distinct: ['profileId'],
  });

  const similarUserIds = similarUsers.map((u) => u.profileId);

  // 3. Lấy danh sách property mà những người đó thích, nhưng user chưa tương tác
  const recommendedProperties = await db.favorite.findMany({
    where: {
      profileId: { in: similarUserIds },
      propertyId: { notIn: interactedIds },
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          tagline: true,
          country: true,
        }
      }
    },
    distinct: ['propertyId'],
  });

  const properties = recommendedProperties.map(item => item.property);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gợi ý dành cho bạn</h1>
      <PropertiesList properties={properties} />
    </main>
  );
}
