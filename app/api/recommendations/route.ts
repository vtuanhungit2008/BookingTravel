import prisma from "@/utils/db"; // Đảm bảo prisma được import đúng
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Lấy tất cả các gợi ý đã lưu của người dùng hiện tại
    const savedRecommendations = await prisma.savedRecommendation.findMany({
      where: {
        profileId: userId,
      },
      include: {
        property: true, // Lấy thông tin của property (có thể tùy chọn bỏ nếu không cần thiết)
      },
    });

    // Trả về kết quả
    return NextResponse.json(savedRecommendations);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
