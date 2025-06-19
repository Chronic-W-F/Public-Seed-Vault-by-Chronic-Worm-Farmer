import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [seeds, setSeeds] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const q = query(
          collection(db, 'publicSeeds'),
          where('uid', '==', firebaseUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSeeds(data);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Unique counts using Set()
  const uniqueBreeders = new Set(seeds.map(seed => seed.breeder));
  const uniqueStrains = new Set(seeds.map(seed => seed.strain));
  const breederCount = uniqueBreeders.size;
  const strainCount = uniqueStrains.size;

  // ✅ Type counts
  const photoCount = seeds.filter(seed => seed.type.toLowerCase() === 'photo').length;
  const autoCount = seeds.filter(seed => seed.type.toLowerCase() === 'auto').length;

  // 🛠️ Optional debug
  console.log("🧪 Breeders:", [...uniqueBreeders]);
  console.log("🧬 Strains:", [...uniqueStrains]);
  console.log("🌞 Photo count:", photoCount);
  console.log("⚡ Auto count:", autoCount);
  console.log("📦 Full seed list:", seeds);

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 flex flex-col items-center">
      <Navbar currentPage="home" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-3xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>

        <p className="text-lg mb-4">Secure your genetics. Search your stash.</p>

        {/* 🌱 Stat Block - FINAL ICON SET */}
        <p className="text-xl mb-1">🧪 {breederCount} Unique Breeders</p>
        <p className="text-xl mb-1">🧬 {strainCount} Unique Strains</p>
        <p className="text-xl mb-1">🌞 {photoCount} Photoperiods</p>
        <p className="text-xl mb-4">⚡ {autoCount} Autoflowers</p>

        <h2 className="text-2xl font-semibold mb-2">💡 Vault Tips</h2>
        <ul className="text-left list-disc list-inside text-gray-800">
          <li>You can search by strain, breeder, type, sex, or notes.</li>
          <li>Use “Unknown” for breeder if not sure — don’t skip it.</li>
          <li>Type = Photo or Auto. Sex = Reg or Fem.</li>
          <li>Log packs as you get them so your vault stays organized.</li>
        </ul>
      </div>
    </div>
  );
}
