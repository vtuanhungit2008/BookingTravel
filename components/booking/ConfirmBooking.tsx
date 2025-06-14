"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/utils/store";
import { createBookingAction } from "@/utils/action";
import FormContainer from "../form/formcontanier";
import { SubmitButton } from "../form/submitbtn";

function ConfirmBooking() {
  const { userId } = useAuth();
  const { propertyId, range, roomType } = useProperty((state) => state); // 👈 thêm roomType
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;

  if (!userId)
    return (
      <SignInButton mode="modal">
        <Button type="button" className="w-full">
          Sign In to Complete Booking
        </Button>
      </SignInButton>
    );

  const createBooking = createBookingAction.bind(null, {
    propertyId,
    checkIn,
    checkOut,
    roomType, // ✅ truyền roomType vào action
  });

  return (
    <section>
      <FormContainer action={createBooking}>
        <SubmitButton text="Reserve" className="w-full" />
      </FormContainer>
    </section>
  );
}

export default ConfirmBooking;