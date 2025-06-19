import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';

export default function SearchPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchSeeds(firebaseUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSeeds = async (uid) => {
    const q = query(collection(db, 'publicSeeds'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResults(data);
  };

  const filteredResults = results.filter((seed) =>
    [seed.breeder, seed.strain, seed.type, seed.sex, seed.notes]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4">
      <Navbar />

      <div className="text-center max-w-3xl mx-auto mt-6">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-xl font-semibold mb-4">Search Your Seed Vault</h2>

        <input
          type="text"
          placeholder="Search by breeder, strain, type, etc."
          className="border p-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 grid gap-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((seed) => (
              <div
                key={seed.id}
                className="border p-4 rounded shadow bg-white/90"
              >
                <h2 className="font-semibold text-lg">
                  {seed.breeder} – {seed.strain}
                </h2>
                <p className="text-sm text-gray-600">
                  {seed.type} / {seed.sex} – {seed.packs} pack(s)
                </p>
                <p className="text-sm mt-1">{seed.notes}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700 mt-4">No matching results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
