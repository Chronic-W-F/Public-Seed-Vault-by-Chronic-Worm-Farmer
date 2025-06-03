// pages/search.js
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from '../components/Navbar';

export default function SearchPage() {
  const [user] = useAuthState(auth);
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!queryText || !user) return setResults([]);

    const fetchSeeds = async () => {
      const snapshot = await getDocs(query(collection(db, 'publicSeeds'), where('uid', '==', user.uid)));
      const allSeeds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allSeeds.filter(seed =>
        `${seed.breeder} ${seed.strain} ${seed.type} ${seed.sex} ${seed.notes || ''}`
          .toLowerCase()
          .includes(queryText.toLowerCase())
      );

      setResults(filtered);
    };

    fetchSeeds();
  }, [queryText, user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🔍 Search the Vault</h1>

      <input
        type="text"
        placeholder="Search by breeder, strain, notes..."
        className="border p-2 rounded w-full mb-6"
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
      />

      {results.map((seed) => (
        <div key={seed.id} className="border-b pb-4 mb-4">
          <h2 className="font-semibold text-lg">{seed.breeder} – {seed.strain}</h2>
          <p className="text-sm text-gray-600">{seed.type} / {seed.sex} – {seed.packs} pack(s)</p>
          {seed.notes && <p className="text-sm mt-1">{seed.notes}</p>}
        </div>
      ))}
    </div>
  );
}
