import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';
import SeedCard from '../components/SeedCard';

export default function SearchPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [seeds, setSeeds] = useState([]);
  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, 'publicSeeds'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSeeds(data);
        setFilteredSeeds(data);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredSeeds(
      seeds.filter(
        (s) =>
          s.breeder.toLowerCase().includes(lower) ||
          s.strain.toLowerCase().includes(lower) ||
          s.type.toLowerCase().includes(lower) ||
          s.sex.toLowerCase().includes(lower) ||
          (s.notes && s.notes.toLowerCase().includes(lower))
      )
    );
  }, [search, seeds]);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this entry?');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'publicSeeds', id));
    setSeeds(seeds.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 flex flex-col items-center">
      <Navbar currentPage="search" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-5xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-2xl font-bold mb-4">Search Your Seed Vault</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by breeder, strain, type, sex, or notes..."
          className="mb-6 w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {filteredSeeds.length === 0 ? (
          <p className="text-gray-700">No seeds match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSeeds.map((seed) => (
              <SeedCard key={seed.id} seed={seed} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
