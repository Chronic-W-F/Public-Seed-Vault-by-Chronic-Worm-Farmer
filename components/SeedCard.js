// pages/search.js
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
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [search, setSearch] = useState('');

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
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-3xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-2xl font-bold mb-4">Search Your Seed Vault</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by breeder, strain, type, sex, or notes..."
          className="mb-6 w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex justify-between mb-4">
          <Link href="/">
            <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700">
              Back to Homepage
            </button>
          </Link>
          <Link href="/entry">
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
              Seed Entry
            </button>
          </Link>
        </div>

        {filteredSeeds.length === 0 ? (
          <p className="text-gray-700">No seeds match your search.</p>
        ) : (
          <ul className="space-y-4">
            {filteredSeeds.map((seed) => (
              <li
                key={seed.id}
                className="bg-white rounded-lg shadow border border-gray-300 p-4 text-left relative"
              >
                <p>
                  <strong>Breeder:</strong> {seed.breeder}
                </p>
                <p>
                  <strong>Strain:</strong> {seed.strain}
                </p>
                <p>
                  <strong>Type:</strong> {seed.type}
                </p>
                <p>
                  <strong>Sex:</strong> {seed.sex}
                </p>
                {seed.notes && (
                  <p>
                    <strong>Notes:</strong> {seed.notes}
                  </p>
                )}
                <p>
                  <strong>Packs:</strong> {seed.packs}
                </p>

                <div className="absolute top-2 right-2 flex space-x-3">
                  <Link href={`/edit/${seed.id}`}>
                    <Pencil className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </Link>
                  <Trash2
                    onClick={() => handleDelete(seed.id)}
                    className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
