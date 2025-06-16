import { auth } from "@clerk/nextjs/server";
import db from "@/utils/db";
import PropertiesList from "@/components/home/PropertiesList";

export default async function RecommendPage() {
  const { userId } = auth();
  if (!userId) return null;

  // 1. Lấy danh sách propertyId đã thích hoặc đã review
  const liked = await db.favorite.findMany({
    where: { profileId: userId },
    select: { propertyId: true },
  });

  const reviewed = await db.review.findMany({
    where: { profileId: userId },
    select: { propertyId: true },
  });

  // ✅ Chuyển thành mảng string[] duy nhất
  const interactedIds = Array.from(
    new Set([...liked, ...reviewed].map((i) => i.propertyId))
  );

  if (interactedIds.length === 0) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gợi ý dành cho bạn</h1>
        <p className="text-gray-600">
          Hãy tương tác với một vài địa điểm để nhận được gợi ý!
        </p>
      </main>
    );
  }

  // 2. Tìm người dùng khác cũng tương tác với các địa điểm đó
  const similarUsers = await db.favorite.findMany({
    where: {
      propertyId: { in: interactedIds },
      profileId: { not: userId },
    },
    select: { profileId: true },
    distinct: ["profileId"],
  });

  const similarUserIds = similarUsers.map((u) => u.profileId);

  if (similarUserIds.length === 0) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gợi ý dành cho bạn</h1>
        <p className="text-gray-600">
          Chưa có người dùng tương tự để gợi ý địa điểm mới.
        </p>
      </main>
    );
  }

  // 3. Lấy các địa điểm mà người dùng tương tự thích, nhưng bạn chưa tương tác
  const recommended = await db.favorite.findMany({
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
        },
      },
    },
    distinct: ["propertyId"],
  });

  const properties = recommended
    .map((item) => item.property)
    .filter(Boolean);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gợi ý dành cho bạn</h1>
      {properties.length > 0 ? (
        <PropertiesList properties={properties} />
      ) : (
        <p className="text-gray-600">
          Hiện chưa có gợi ý phù hợp. Hãy tiếp tục thích hoặc đánh giá các địa điểm để được gợi ý tốt hơn!
        </p>
      )}
    </main>
  );
}
