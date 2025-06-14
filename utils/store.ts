import { create } from "zustand";
import { PropertyState, TopProperty } from "./types";





export type Store = {
  properties: TopProperty[] | null;
  setProperties: (data: TopProperty[]) => void;
};

export const useProperty = create<PropertyState>((set) => ({
  propertyId: "",
  price: 0,
  bookings: [],
  range: undefined,
  roomType: "STANDARD", // mặc định loại phòng thường
  setRoomType: (type) => set({ roomType: type }),
}));

