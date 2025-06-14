"use client";

import { useProperty } from "@/utils/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const roomTypes = [
  { value: "STANDARD", label: "Standard" },
  { value: "VIP", label: "VIP" },
  { value: "PRESIDENT", label: "President" },
];

export default function RoomTypeSelector() {
  const { roomType, setRoomType } = useProperty();

  return (
    <div className="mb-4">
      <Label htmlFor="roomType">Room Type</Label>
      <Select value={roomType} onValueChange={setRoomType}>
        <SelectTrigger id="roomType">
          <SelectValue placeholder="Select room type" />
        </SelectTrigger>
        <SelectContent>
          {roomTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
