"use client";

import { useAuth } from "@clerk/nextjs";
import { useProperty } from "@/utils/store";
import { createBookingAction } from "@/utils/action";
import FormContainer from "../form/formcontanier";
import { SubmitButton } from "../form/submitbtn";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function ConfirmBooking() {
  const { userId } = useAuth();
  const { propertyId, range, roomType } = useProperty((state) => state);
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;

  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const createBooking = createBookingAction.bind(null, {
    propertyId,
    checkIn,
    checkOut,
    roomType,
    guestInfo: userId ? undefined : guestInfo,
  });

  return (
    <FormContainer action={createBooking}>
      {!userId ? (
        <div className="space-y-4">
          <Input
            placeholder="Họ và tên"
            required
            value={guestInfo.fullName}
            onChange={(e) =>
              setGuestInfo({ ...guestInfo, fullName: e.target.value })
            }
          />
          <Input
            type="email"
            placeholder="Email"
            required
            value={guestInfo.email}
            onChange={(e) =>
              setGuestInfo({ ...guestInfo, email: e.target.value })
            }
          />
          <Input
            placeholder="Số điện thoại"
            required
            value={guestInfo.phone}
            onChange={(e) =>
              setGuestInfo({ ...guestInfo, phone: e.target.value })
            }
          />
          <SubmitButton text="Tiếp tục đặt phòng" className="w-full" />
        </div>
      ) : (
        <SubmitButton text="Đặt phòng" className="w-full" />
      )}
    </FormContainer>
  );
}

export default ConfirmBooking;
