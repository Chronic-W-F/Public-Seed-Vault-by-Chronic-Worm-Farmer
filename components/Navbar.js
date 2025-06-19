import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const goHome = () => router.push('/');
  const goEntry = () => router.push('/entry');
  const goSearch = () => router.push('/search');

  return (
    <nav className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 px-4 mb-4">
      <div className="flex gap-2">
        {currentPath === '/' && (
          <>
            <button onClick={goEntry} className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm">
              ➕ Add Seeds
            </button>
            <button onClick={goSearch} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">
              🔍 Search
            </button>
          </>
        )}

        {currentPath === '/entry' && (
          <>
            <button onClick={goHome} className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm">
              ⬅ Return to Homepage
            </button>
            <button onClick={goSearch} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">
              🔍 Search
            </button>
          </>
        )}

        {currentPath === '/search' && (
          <>
            <button onClick={goHome} className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm">
              ⬅ Return to Homepage
            </button>
            <button onClick={goEntry} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">
              ➕ Add Seeds
            </button>
          </>
        )}

        <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
