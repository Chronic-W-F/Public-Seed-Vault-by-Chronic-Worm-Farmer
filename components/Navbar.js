// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const linkClass = (path) =>
    `px-4 py-2 rounded-md text-sm font-medium ${
      router.pathname === path
        ? 'bg-green-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="flex gap-2 justify-center items-center py-4 shadow mb-6 bg-white">
      <Link href="/">
        <span className={linkClass('/')}>🌱 Data Entry</span>
      </Link>
      <Link href="/search">
        <span className={linkClass('/search')}>🔍 Search</span>
      </Link>
    </nav>
  );
}
