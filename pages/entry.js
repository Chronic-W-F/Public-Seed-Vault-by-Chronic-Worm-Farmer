import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import SeedEntryForm from '../components/SeedEntryForm';

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center flex flex-col items-center p-4">
      <h1 className="text-4xl font-black mb-4">CHRONIC SEED VAULT</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => router.push('/search')}
          className="px-4 py-1 bg-white border rounded hover:bg-gray-100"
        >
          Search
        </button>
        <button
          onClick={async () => {
            await auth.signOut();
            router.push('/');
          }}
          className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      <SeedEntryForm />
    </div>
  );
}
