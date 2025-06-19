import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import SeedEntryForm from '../components/SeedEntryForm';
import Navbar from '../components/Navbar';

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center flex flex-col items-center p-4">
      <Navbar />

      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-3xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-4">CHRONIC SEED VAULT</h1>

        {/* Seed entry form only – clean and simple */}
        <SeedEntryForm />
      </div>
    </div>
  );
}
