// components/Navbar.js
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/" className="hover:underline">
          Add Entry
        </Link>
        <Link href="/search" className="hover:underline">
          Search
        </Link>
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
