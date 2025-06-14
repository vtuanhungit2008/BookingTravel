// utils/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmail = async ({
  email,
  fullName,
  propertyName,
  checkIn,
  checkOut,
  orderTotal,
}: {
  email: string;
  fullName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  orderTotal: number;
}) => {
  try {
    await resend.emails.send({
       from: 'Booking App <onboarding@resend.dev>',
      to: [email],
      subject: 'Xác nhận đặt phòng thành công',
      html: `
        <p>Xin chào <strong>${fullName}</strong>,</p>
        <p>Bạn đã đặt phòng tại <strong>${propertyName}</strong> từ <strong>${checkIn}</strong> đến <strong>${checkOut}</strong>.</p>
        <p>Tổng tiền: <strong>$${orderTotal}</strong></p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
