import { calculateDaysBetween } from "@/utils/calendar";

type RoomType = "STANDARD" | "VIP" | "PRESIDENT";

type BookingDetails = {
  checkIn: Date;
  checkOut: Date;
  price: number;
  roomType?: RoomType;
};

const roomTypeMultiplier: Record<RoomType, number> = {
  STANDARD: 1,
  VIP: 1.5,
  PRESIDENT: 2,
};

export const calculateTotals = ({
  checkIn,
  checkOut,
  price,
  roomType = "STANDARD", // 👈 mặc định nếu không truyền
}: BookingDetails) => {
  const totalNights = calculateDaysBetween({ checkIn, checkOut });
  const multiplier = roomTypeMultiplier[roomType];
  const subTotal = totalNights * price * multiplier;

  const cleaning = 21;
  const service = 40;
  const tax = subTotal * 0.1;
  const orderTotal = subTotal + cleaning + service + tax;

  return { totalNights, subTotal, cleaning, service, tax, orderTotal };
};
