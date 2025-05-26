import Link from 'next/link';
import { FaHotel } from 'react-icons/fa'; // Biểu tượng khách sạn
import { Button } from '../ui/button';

function Logo() {
  return (
    <Link href="/" aria-label="HomeAway - Home" className="inline-flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="text-black-600 dark:text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75V6.75a.75.75 0 011.5 0v6H18v-1.5a1.5 1.5 0 113 0v7.5M4.5 12.75h15a.75.75 0 01.75.75v5.25m-15.75 0V13.5a.75.75 0 01.75-.75z"
        />
      </svg>
      <span className="text-xl font-bold text-black-700 dark:text-white">HOTELBOOKING</span>
    </Link>
  );
}


export default Logo;
