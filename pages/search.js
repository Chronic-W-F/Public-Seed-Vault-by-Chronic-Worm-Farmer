// pages/search.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';

export default function SearchVault() {
  const [seeds, setSeeds] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchSeeds = async () => {
      const snapshot = await getDocs(collection(db, 'publicSeeds'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeeds(data);
    };
    fetchSeeds();
  }, []);

  const filteredSeeds = seeds.filter((seed) => {
    const q = query.toLowerCase();
    return (
      seed.breeder.toLowerCase().includes(q) ||
      seed.strain.toLowerCase().includes(q) ||
      seed.type.toLowerCase().includes(q) ||
      seed.sex.toLowerCase().includes(q) ||
      (seed.notes && seed.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🔍 Search the Vault</h1>
      <input
        type="text"
        placeholder="Search by breeder, strain, type, etc..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      {query.trim() !== '' && filteredSeeds.length > 0 && (
        <div className="grid gap-4">
          {filteredSeeds.map((seed) => (
            <div key={seed.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold text-lg">
                {seed.breeder} – {seed.strain}
              </h2>
              <p className="text-sm text-gray-600">
                {seed.type} / {seed.sex} – {seed.packs} pack(s)
              </p>
              {seed.notes && <p className="text-sm mt-1">{seed.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {query.trim() !== '' && filteredSeeds.length === 0 && (
        <p className="text-gray-500 italic">No results found.</p>
      )}
    </div>
  );
}
