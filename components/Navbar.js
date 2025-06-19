import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 px-4 mb-4">
      <h1 className="text-xl font-black tracking-wide">🌿 Chronic Vault</h1>
      <div className="flex gap-2">
        <button
          onClick={() => router.push('/entry')}
          className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
        >
          ➕ Add Seeds
        </button>
        <button
          onClick={() => router.push('/search')}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
        >
          🔍 Search
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
