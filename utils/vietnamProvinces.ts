import { getProvinces } from 'vn-provinces';

export const vietnamProvinces = getProvinces().map((p) => {
  const locations: Record<string, [number, number]> = {
    "01": [21.0285, 105.8542], // Hà Nội
    "79": [10.762622, 106.660172], // HCM
    "48": [16.0544, 108.2022], // Đà Nẵng
    // Add thêm mã khác nếu cần
  };
  return {
    ...p,
    location: locations[p.code] || [16.0471, 108.2068], // fallback Đà Nẵng
  };
});

export const findProvinceByCode = (code: string) =>
  vietnamProvinces.find((p) => p.code === code);
