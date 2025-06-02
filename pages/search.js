// pages/search.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function SearchPage() {
  const [seeds, setSeeds] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchSeeds = async () => {
      const snapshot = await getDocs(collection(db, 'publicSeeds'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeeds(data);
      setFiltered(data);
    };
    fetchSeeds();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setQuery(term);
    setFiltered(
      seeds.filter((seed) =>
        [seed.breeder, seed.strain, seed.type, seed.sex].some((field) =>
          field?.toLowerCase().includes(term)
        )
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Search the Seed Vault</h1>
      <input
        type="text"
        placeholder="Search by breeder, strain, type, or sex..."
        value={query}
        onChange={handleSearch}
        className="border p-2 rounded w-full mb-6"
      />

      <div className="grid gap-4">
        {filtered.map((seed) => (
          <div key={seed.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">
              {seed.breeder} – {seed.strain}
            </h2>
            <p className="text-sm text-gray-600">
              {seed.type} / {seed.sex} – {seed.packs} pack(s)
            </p>
            <p className="text-sm mt-1">{seed.notes}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 italic">No matching seeds found.</p>
        )}
      </div>
    </div>
  );
}
