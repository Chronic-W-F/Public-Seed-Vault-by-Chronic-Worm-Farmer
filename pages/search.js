// /pages/search.js

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Login from '../components/Login';
import Navbar from '../components/Navbar';

export default function Search() {
  const [user, setUser] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, 'publicSeeds'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSeeds(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredSeeds = seeds.filter(seed => {
    const search = searchTerm.toLowerCase();
    return (
      seed.breeder?.toLowerCase().includes(search) ||
      seed.strain?.toLowerCase().includes(search) ||
      seed.type?.toLowerCase().includes(search) ||
      seed.sex?.toLowerCase().includes(search) ||
      seed.notes?.toLowerCase().includes(search)
    );
  });

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🔍 Search Your Seed Vault</h1>
      <input
        type="text"
        placeholder="Search by breeder, strain, type, etc."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      <div className="grid gap-4">
        {filteredSeeds.map((seed) => (
          <div key={seed.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{seed.breeder} – {seed.strain}</h2>
            <p className="text-sm text-gray-600">{seed.type} / {seed.sex} – {seed.packs} pack(s)</p>
            <p className="text-sm mt-1">{seed.notes}</p>
          </div>
        ))}
        {filteredSeeds.length === 0 && (
          <p className="text-gray-500 text-center">No matching entries found.</p>
        )}
      </div>
    </div>
  );
}
