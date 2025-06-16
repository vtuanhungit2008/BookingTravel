'use server';
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { supabase, uploadImage } from './supabase';
import { createReviewSchema, imageSchema, profileSchema, propertySchema, searchAI, validateWithZodSchema } from './schemas';
import { BookingWithProperty, Message } from './types';
import { calculateTotals } from './calculateTotals';
import { formatDate } from './format';
import { findProvinceByCode } from './vietnamProvinces';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    const rawData = Object.fromEntries(formData);
    console.log("rawdata",rawData);

    
    const validatedFields = validateWithZodSchema(profileSchema, rawData);
    
    console.log("valider",validatedFields);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
  redirect('/');
};
const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in') // hoặc '/login'
  }

  if (!user.privateMetadata.hasProfile) {
    redirect('/profile/create')
  }

  return user
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) return redirect('/profile/create');
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
  const validatedFields = validateWithZodSchema(profileSchema, rawData);
    if (!validatedFields) {
      
      throw new Error();
    }

    if (db) {
      await db?.profile?.update({
        where: {
          clerkId: user.id,
        },
        data: validatedFields,
      });
    }
    revalidatePath('/profile');
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath('/profile');
    return { message: 'Profile image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};
export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    // 👉 Tìm tên tỉnh từ mã code
    const provinceCode = rawData.country as string;
    const province = findProvinceByCode(provinceCode);

    if (!province) {
      throw new Error("Mã tỉnh không hợp lệ");
    }

    // Gán lại tên tỉnh vào rawData.country
    rawData.country = province.name;

    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });

    const fullPath = await uploadImage(validatedFile.image);

    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/");
};

export const fetchProperties = async ({
  search = '',
  category,
  location,
}: {
  search?: string;
  category?: string;
  location?: string;
}) => {
  const { userId } = auth(); // 👈 đây là Clerk ID (clerkId)

  const properties = await db.property.findMany({
    where: {
      AND: [
        category ? { category } : {},
        location
          ? {
              country: {
                contains: location,
                mode: 'insensitive',
              },
            }
          : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { tagline: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    },
    include: {
      reviews: { select: { rating: true } },
      favorites: userId
        ? {
            where: {
              profileId: userId, // 👈 phải là clerkId (khớp với Favorite.profileId)
            },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  return properties.map((p) => {
    const ratings = p.reviews.map((r) => r.rating);
    const average =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null;

    return {
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      country: p.country,
      tagline: p.tagline,
      favoriteId: p.favorites?.[0]?.id ?? null, // 👈 chuẩn
      rating: average,
      reviewCount: ratings.length,
    };
  });
};


export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};


export const toggleFavoriteAction = async (
  _: any,
  formData: FormData
): Promise<{ favoriteId: string | null }> => {
  const { userId } = auth();
  if (!userId) {
    console.warn('Unauthorized toggle favorite');
    return { favoriteId: null };
  }

  const propertyId = formData.get('propertyId') as string | null;
  const favoriteId = formData.get('favoriteId') as string | null;

  if (!propertyId) {
    console.warn('Missing propertyId');
    return { favoriteId: null };
  }

  try {
    if (favoriteId && favoriteId.trim() !== '') {
      // 👈 chỉ xóa nếu có ID hợp lệ
      await db.favorite.delete({ where: { id: favoriteId } });
      return { favoriteId: null };
    }

    const created = await db.favorite.create({
      data: {
        profileId: userId,
        propertyId,
      },
    });
    return { favoriteId: created.id };
  } catch (error) {
    console.error('toggleFavoriteAction error:', error);
    return { favoriteId: null };
  }
};



export const fetchFavorites = async () => {
  const user = await getAuthUser(); // đảm bảo trả về user có id là Clerk ID

  const favorites = await db.favorite.findMany({
    where: { profileId: user.id },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          price: true,
          country: true,
          image: true,
          reviews: { select: { rating: true } },
        },
      },
    },
  });

  return favorites.map((favorite) => {
    const ratings = favorite.property.reviews.map((r) => r.rating);
    const average =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null;

    return {
      ...favorite.property,
      favoriteId: favorite.id, // dùng để toggle yêu thích
      rating: average,
      reviewCount: ratings.length,
    };
  });
};



export async function fetchPropertyRating(propertyId: string) {
  const result = await db.review.groupBy({
    by: ["propertyId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  });

  // empty array if no reviews
  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });

    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};


export async function createReviewAction(prevState: any, formData: FormData) {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: "Review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function fetchPropertyReviews(propertyId: string) {
  const reviews = await db.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
}

export const fetchPropertyReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return reviews;
};

export const findExistingReview = async (
  userId: string,
  propertyId: string
) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  });
};



export const fetchPropertyDetails = async (propertyId: string) => {
  const { userId } = auth();

  const property = await db.property.findUnique({
    where: { id: propertyId },
    include: {
      profile: true,
      bookings: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      favorites: userId
        ? {
            where: { profileId: userId },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  if (!property) return null;

  const ratings = property.reviews.map((r) => r.rating);
  const averageRating = ratings.length > 0
    ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
    : null;

  return {
    ...property,
    rating: averageRating,      // ✅ Đảm bảo là số, không phải string
    reviewCount: ratings.length,
    favoriteId: property.favorites?.[0]?.id ?? null,
  };
};

export const getOptionalAuthUser = async () => {
  const user = await currentUser();

  // Trả về `null` nếu không đăng nhập
  return user ?? null;
};
export const createBookingAction = async (form: {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  roomType: 'STANDARD' | 'VIP' | 'PRESIDENT';
  guestInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
}) => {
  const user = await getOptionalAuthUser();
  const { propertyId, checkIn, checkOut, roomType, guestInfo } = form;

  if (user?.id) {
    await db.booking.deleteMany({
      where: {
        profileId: user.id,
        paymentStatus: false,
      },
    });
  }

  const property = await db.property.findUnique({
    where: { id: propertyId },
    select: { price: true },
  });
  if (!property) return { message: 'Không tìm thấy chỗ ở' };

  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: property.price,
    roomType,
  });

  try {
    let bookingId: string;

    if (!user?.id && guestInfo) {
      const guest = await db.guest.create({ data: guestInfo });

      const booking = await db.booking.create({
        data: {
          checkIn,
          checkOut,
          orderTotal,
          totalNights,
          roomType,
          guestId: guest.id,
          propertyId,
        },
      });

      bookingId = booking.id;
    } else if (user?.id) {
      const booking = await db.booking.create({
        data: {
          checkIn,
          checkOut,
          orderTotal,
          totalNights,
          roomType,
          profileId: user.id,
          propertyId,
        },
      });

      bookingId = booking.id;
    } else {
      return { message: 'Thiếu thông tin người dùng' };
    }

return { message: "Đặt phòng thành công", redirectUrl: `/checkout?bookingId=${bookingId}` };
  } catch (error) {
    return renderError(error);
  }
};




export async function deleteBookingAction(prevState: { bookingId: string }) {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    const result = await db.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath("/bookings");
    return { message: "Booking deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}
export const fetchBookings = async (): Promise<BookingWithProperty[]> => {
  const user = await getOptionalAuthUser();
  const cookieStore = cookies();
  const guestId = cookieStore.get('guestId')?.value;

  if (!user?.id && !guestId) return [];

  const filters = [
    user?.id ? { profileId: user.id } : undefined,
    guestId ? { guestId } : undefined,
  ].filter(Boolean) as Prisma.BookingWhereInput[];

  const bookings = await db.booking.findMany({
    where: {
      OR: filters,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      checkIn: 'desc',
    },
  });

  return bookings as BookingWithProperty[];
};
export const fetchRentals = async () => {
  const user = await getAuthUser();
  const rentals = await db.property.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const rentalsWithBookingSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightsSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id,
        },
        _sum: {
          totalNights: true,
        },
      });

      const orderTotalSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...rental,
        totalNightsSum: totalNightsSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      };
    })
  );

  return rentalsWithBookingSums;
};

export async function deleteRentalAction(prevState: { propertyId: string }) {
  const { propertyId } = prevState;
  const user = await getAuthUser();

  try {
    await db.property.delete({
      where: {
        id: propertyId,
        profileId: user.id,
      },
    });

    revalidatePath("/rentals");
    return { message: "Rental deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export const fetchRentalDetails = async (propertyId: string) => {
  const user = await getAuthUser();

  return db.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id,
    },
  });
};

export const updatePropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get('id') as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
      },
    });

    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: 'Update Successful' };
  } catch (error) {
    return renderError(error);
  }
};

export const updatePropertyImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const propertyId = formData.get('id') as string;

  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: 'Property Image Updated Successful' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchReservations = async () => {
  const user = await getAuthUser();

  const reservations = await db.booking.findMany({
    where: {
      property: {
        profileId: user.id,
      },
    },

    orderBy: {
      createdAt: 'desc', // or 'asc' for ascending order
    },

    include: {
      property: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true,
        },
      }, // include property details in the result
    },
  });
  return reservations;
};


const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

export const fetchStats = async () => {
  await getAdminUser();

  const usersCount = await db.profile.count();
  const propertiesCount = await db.property.count();
  const bookingsCount = await db.booking.count();

  return {
    usersCount,
    propertiesCount,
    bookingsCount,
  };
};

export const fetchChartsData = async () => {
  await getAdminUser();
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  const bookings = await db.booking.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  let bookingsPerMonth = bookings.reduce((total, current) => {
    const date = formatDate(current.createdAt, true);

    const existingEntry = total.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      total.push({ date, count: 1 });
    }
    return total;
  }, [] as Array<{ date: string; count: number }>);
  return bookingsPerMonth;
};

export const fetchReservationStats = async () => {
  const user = await getAuthUser();
  const properties = await db.property.count({
    where: {
      profileId: user.id,
    },
  });

  const totals = await db.booking.aggregate({
    _sum: {
      orderTotal: true,
      totalNights: true,
    },
    where: {
      property: {
        profileId: user.id,
      },
    },
  });

  return {
    properties,
    nights: totals._sum.totalNights || 0,
    amount: totals._sum.orderTotal || 0,
  };
};


 export const gennerateAI = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  
  try {
    const rawData = Object.fromEntries(formData);
  
    const file = formData.get('image') as File;
    console.log(
      "data",rawData);
    const validatedFields = validateWithZodSchema(searchAI, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    console.log("file",validatedFile);
    console.log(validatedFields);
    
    if (!validatedFields) {
      throw new Error();
    }

   
    
    return { message: 'Waiting generate AI' };
  } catch (error) {
    return renderError(error);
  }
};