import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';

export default function SearchPage() {
  const [seeds, setSeeds] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchSeeds = async () => {
      const snapshot = await getDocs(collection(db, 'publicSeeds'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeeds(data);
      setFiltered(data);
    };
    fetchSeeds();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      seeds.filter(
        seed =>
          seed.breeder.toLowerCase().includes(q) ||
          seed.strain.toLowerCase().includes(q) ||
          seed.type.toLowerCase().includes(q) ||
          seed.sex.toLowerCase().includes(q) ||
          (seed.notes && seed.notes.toLowerCase().includes(q))
      )
    );
  }, [query, seeds]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🔍 Search the Vault</h1>
        <input
          type="text"
          placeholder="Search by breeder, strain, type, etc."
          className="border p-2 rounded w-full mb-6"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 ? (
          <p className="text-gray-600 italic">No matches found.</p>
        ) : (
          <div className="grid gap-4">
            {filtered.map((seed) => (
              <div key={seed.id} className="border p-4 rounded shadow">
                <h2 className="font-semibold text-lg">
                  {seed.breeder} – {seed.strain}
                </h2>
                <p className="text-sm text-gray-600">
                  {seed.type} / {seed.sex} – {seed.packs} pack(s)
                </p>
                {seed.notes && (
                  <p className="text-sm mt-1 text-gray-700 whitespace-pre-line">
                    {seed.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
