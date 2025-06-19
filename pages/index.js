import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [breederCount, setBreederCount] = useState(0);
  const [strainCount, setStrainCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const q = query(collection(db, 'publicSeeds'), where('userId', '==', firebaseUser.uid));
        const snapshot = await getDocs(q);
        const seeds = snapshot.docs.map(doc => doc.data());

        const breeders = new Set(seeds.map(seed => seed.breeder.trim().toLowerCase()));
        const strains = new Set(seeds.map(seed => seed.strain.trim().toLowerCase()));

        setBreederCount(breeders.size);
        setStrainCount(strains.size);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 flex flex-col items-center">
      <Navbar />

      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-3xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <p className="text-lg font-medium mb-6">Secure your genetics. Search your stash.</p>

        <div className="flex justify-around mb-6 text-left flex-wrap gap-6">
          <div>
            <p className="text-xl font-bold">🧪 {breederCount}</p>
            <p className="text-sm text-gray-700">Unique Breeders</p>
          </div>
          <div>
            <p className="text-xl font-bold">🧬 {strainCount}</p>
            <p className="text-sm text-gray-700">Unique Strains</p>
          </div>
        </div>

        <div className="bg-white/70 p-4 rounded text-left text-sm">
          <h2 className="text-md font-bold mb-2">💡 Vault Tips</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>You can search by strain, breeder, type, sex, or notes.</li>
            <li>Use “Unknown” for breeder if not sure — don’t skip it.</li>
            <li>Type = Photo or Auto. Sex = Reg or Fem.</li>
            <li>Log packs as you get them so your vault stays organized.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
