// pages/search.js
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function Search() {
  const [user] = useAuthState(auth);
  const [seeds, setSeeds] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchSeeds = async () => {
      const q = query(collection(db, 'publicSeeds'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeeds(data);
    };

    fetchSeeds();
  }, [user]);

  const filtered = seeds.filter((seed) =>
    `${seed.breeder} ${seed.strain} ${seed.type} ${seed.sex} ${seed.notes}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔎 Search Your Seed Vault</h1>

      <input
        type="text"
        placeholder="Search by breeder, strain, type, sex, or notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      <div className="grid gap-4">
        {filtered.map((seed) => (
          <div key={seed.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{seed.breeder} – {seed.strain}</h2>
            <p className="text-sm text-gray-600">{seed.type} / {seed.sex} – {seed.packs} pack(s)</p>
            <p className="text-sm mt-1">{seed.notes}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 italic text-center">No matching seeds found.</p>
        )}
      </div>
    </div>
  );
}
