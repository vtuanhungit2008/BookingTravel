// components/Footer.tsx
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray text-gray-300 py-10 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1 - Logo & mô tả */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-white">HomeAway</h4>
          <p className="text-sm">Feel at home, away from home.</p>
          <p className="mt-4 text-xs text-gray-500">© 2025 HomeAway. All rights reserved.</p>
        </div>

        {/* Cột 2 - Liên kết nhanh */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/rooms" className="hover:underline">Rooms</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Cột 3 - Đăng ký / Mạng xã hội */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-white">Stay Connected</h4>
          <p className="text-sm mb-4">Subscribe to get the latest updates and offers.</p>
          <form className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 w-full rounded bg-gray-800 text-sm placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 text-sm"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="mailto:contact@homeaway.com" className="hover:text-white"><FaEnvelope /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
