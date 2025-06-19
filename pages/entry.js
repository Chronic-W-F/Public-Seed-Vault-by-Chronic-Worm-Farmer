import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import SeedEntryForm from '../components/SeedEntryForm';

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center flex flex-col items-center p-4">
      <h1 className="text-4xl font-black tracking-wide mb-4 text-center text-black drop-shadow-md">
        CHRONIC SEED VAULT
      </h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => router.push('/search')}
          className="px-4 py-1 bg-white border rounded hover:bg-gray-100 transition"
        >
          Search
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </div>

      <SeedEntryForm />
    </div>
  );
}
