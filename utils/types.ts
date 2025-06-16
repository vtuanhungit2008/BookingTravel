
import { DateRange } from "react-day-picker";


export type PropertyCardProps = {
  id: string;
  name: string;
  image: string;
  tagline: string;
  country: string;
  price: number;
  favoriteId?: string | null;
  rating?: string | null;
  reviewCount?: number;
};
export  interface Message {
  id: number;
  username: string;
  message: string;
  inserted_at: string;
 
}
export type MessageProps = {
  username: string;
  message: string;
};

export type DateRangeSelect = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export type Booking = {
  checkIn: Date;
  checkOut: Date;
};
export type PropertyState = {
  propertyId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
  roomType: RoomType;
  setRoomType: (type: RoomType) => void;
};
export type TopProperty = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: string;
  reviewCount: number;
};

export type RatingData = {
  rating: number;
  count: number;
};

export type PropertyMetaStore = {
  ratings: Record<string, RatingData>;
  setRating: (id: string, data: RatingData) => void;
};

export type RoomType = "STANDARD" | "VIP" | "PRESIDENT";

export type PropertyMetaStore1 = {
  favorites: Record<string, string | null>; // lưu favoriteId (hoặc null)
  setFavorite: (id: string, favoriteId: string | null) => void;
};

export type BookingWithProperty = {
  id: string;
  profileId: string | null;
  guestId: string | null;
  propertyId: string;
  voucherId: string | null;
  discount: number;
  finalPaid: number | null;
  orderTotal: number;
  totalNights: number;
  checkIn: Date;
  checkOut: Date;
  paymentStatus: boolean;
  roomType: string;
  createdAt: Date;
  updatedAt: Date;
  property: {
    id: string;
    name: string;
    country: string;
  };
};
export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{
  message: string;
  redirectUrl?: string; // ✅ cho phép redirect nếu cần
}>;