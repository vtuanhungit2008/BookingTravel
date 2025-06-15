import { FaStar } from 'react-icons/fa';

type Props = {
  rating: string; // Đã format toFixed(1) từ server
  count: number;
  inPage?: boolean;
};

export default function PropertyRating({ rating, count, inPage = false }: Props) {
  if (!count || !rating) return null;

  const className = `flex gap-1 items-center ${inPage ? 'text-md' : 'text-xs'}`;
  const countText = count === 1 ? 'review' : 'reviews';
  const countValue = `(${count}) ${inPage ? countText : ''}`;

  return (
    <span className={className}>
      <FaStar className="w-3 h-3 text-yellow-500" />
      {rating} {countValue}
    </span>
  );
}
