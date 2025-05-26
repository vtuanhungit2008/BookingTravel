
import PropertyCard from "@/components/card/PropertyCard";
import type { PropertyCardProps } from "@/utils/types";

interface HistoryListProps {
  history: {
    id: string;
    viewedAt: string;
    property: PropertyCardProps;
  }[];
}

export default function HistoryList({ history = [] }: HistoryListProps) {
  if (!history.length) return <p className="text-zinc-500">Bạn chưa xem sản phẩm nào.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {history.map((item) => (
        <PropertyCard key={item.id} property={item.property} />
        
      ))

      }
    </div>
  );
}
