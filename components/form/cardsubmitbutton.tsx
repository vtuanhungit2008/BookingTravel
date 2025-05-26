'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      className={`p-2 cursor-pointer transition-colors ${
        isFavorite && !pending ? 'text-red-500' : 'text-gray-400'
      }`}
      aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      disabled={pending}
    >
      {pending ? (
        <ReloadIcon className="animate-spin w-4 h-4" />
      ) : isFavorite ? (
        <FaHeart className="w-4 h-4" />
      ) : (
        <FaRegHeart className="w-4 h-4" />
      )}
    </Button>
  );
};
