'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [countdown, setCountdown] = useState(600);

  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState('');
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]); // NEW

  const applyVoucher = async () => {
    try {
      const res = await axios.post('/api/apply-voucher', { code: voucherCode });
      const applied = res.data;

      setVoucher(applied);
      setVoucherError('');

      const secretRes = await axios.post('/api/payment', {
        bookingId,
        voucherCode: applied.code,
      });
      setClientSecret(secretRes.data.clientSecret);
    } catch (err: any) {
      setVoucher(null);
      setVoucherError(err?.response?.data?.error || 'Lỗi không xác định');
    }
  };

  const fetchClientSecret = useCallback(async () => {
    if (!bookingId) return '';

    const res = await axios.post('/api/payment', {
      bookingId,
      voucherCode: '',
    });

    setClientSecret(res.data.clientSecret);

    const booking = await axios.get(`/api/booking?id=${bookingId}`);
    setBookingInfo(booking.data);

    return res.data.clientSecret;
  }, [bookingId]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get('/api/my-vouchers');
        setAvailableVouchers(res.data.vouchers || []);
      } catch (err) {
        console.error('Lỗi lấy voucher:', err);
      }
    };

    if (bookingInfo) fetchVouchers();
  }, [bookingInfo]);

  if (!bookingId) return <p className="text-center mt-10">Không tìm thấy mã đặt phòng.</p>;
  if (!clientSecret || !bookingInfo) return <p className="text-center mt-10">Đang tải...</p>;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const original = bookingInfo.originalTotal;
  const couponDiscount = bookingInfo.discount || 0;
  const voucherDiscount =
    voucher?.type === 'PERCENT'
      ? Math.round(bookingInfo.orderTotal * (voucher.discount / 100))
      : voucher?.discount || 0;

  const finalTotal = Math.max(bookingInfo.orderTotal - voucherDiscount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between text-sm font-medium text-red-600 mb-4">
            <span>Chúng tôi đang giữ giá cho quý khách</span>
            <span className={`font-mono text-base ${countdown < 120 ? 'text-red-700' : ''}`}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-3">Phương thức thanh toán</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked readOnly />
              <span>Thẻ tín dụng / ghi nợ (Stripe)</span>
            </label>
          </div>

          <div key={clientSecret} className="rounded-xl overflow-hidden">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret: () => Promise.resolve(clientSecret) }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Nếu gặp vấn đề, vui lòng{' '}
            <a href="/support" className="underline text-blue-600 hover:text-blue-800">liên hệ hỗ trợ</a>.
          </p>
        </div>

        <div className="md:col-span-5 space-y-6">
          <div className="mt-3 space-y-1">
            <p className="text-lg bg-white p-4 rounded-2xl shadow-md border border-gray-100">
              🏨 {bookingInfo.checkInFormatted} → {bookingInfo.checkOutFormatted}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
            <Image
              src={bookingInfo.property.image}
              alt={bookingInfo.property.name}
              width={500}
              height={300}
              className="rounded-lg w-full h-48 object-cover mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{bookingInfo.property.name}</h2>
            <p className="text-sm text-gray-500">📅 {bookingInfo.totalNights} đêm</p>
          </div>

          {/* Mã giảm giá + Gợi ý voucher */}
          <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 space-y-3">
            <label className="text-sm font-semibold text-gray-700">Mã giảm giá</label>
            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="NHAPMA2024"
                className="border border-gray-300 p-2 rounded-lg w-full text-sm"
              />
              <button
                onClick={applyVoucher}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Áp dụng
              </button>
            </div>
            {voucher && (
              <p className="text-green-600 text-sm">✅ Đã áp dụng mã: <strong>{voucher.code}</strong></p>
            )}
            {voucherError && (
              <p className="text-red-500 text-sm">{voucherError}</p>
            )}
            {availableVouchers.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-1">🎁 Voucher hiện có:</p>
                <div className="flex flex-wrap gap-2">
                  {availableVouchers.map((v) => {
                    const display =
                      v.type === 'PERCENT'
                        ? `Giảm ${v.discount}%`
                        : `Giảm ${v.discount.toLocaleString()}đ`;
                    return (
                      <button
                        key={v.code}
                        onClick={() => {
                          setVoucherCode(v.code);
                          applyVoucher();
                        }}
                        className="bg-gray-100 hover:bg-blue-100 border border-gray-200 text-sm rounded-lg px-3 py-1 transition"
                      >
                        {display} ({v.code})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Giá gốc</span>
              <span className="line-through text-gray-400">${original}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Coupon hệ thống</span>
              <span className="text-green-600 font-medium">-${couponDiscount}</span>
            </div>
            {voucher && (
              <div className="flex justify-between text-sm">
                <span>Mã giảm giá</span>
                <span className="text-green-600 font-medium">-${voucherDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-black pt-2 border-t">
              <span>Tổng thanh toán</span>
              <span>${finalTotal}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Thông tin khách hàng</h3>
            <div className="space-y-2 pl-1">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-lg">🙍‍♂️</span>
                <p className="text-sm text-gray-800 font-medium">
                  {bookingInfo.guest?.fullName || bookingInfo.profile?.firstName || 'Khách vãng lai'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-lg">📧</span>
                <p className="text-sm text-gray-600">
                  {bookingInfo.guest?.email || bookingInfo.profile?.email || 'Không có email'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
