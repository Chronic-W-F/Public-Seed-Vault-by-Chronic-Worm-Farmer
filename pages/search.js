// pages/search.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from '../components/Navbar';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [allSeeds, setAllSeeds] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchSeeds = async () => {
      if (user) {
        const q = query(collection(db, 'seeds'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const userSeeds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllSeeds(userSeeds);
      }
    };

    fetchSeeds();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSeeds([]);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = allSeeds.filter(
      seed =>
        seed.breeder.toLowerCase().includes(lower) ||
        seed.strain.toLowerCase().includes(lower)
    );
    setFilteredSeeds(filtered);
  }, [searchTerm, allSeeds]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">🔍 Search Seed Vault</h1>
        <input
          type="text"
          placeholder="Search by breeder or strain"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {filteredSeeds.length > 0 && (
          <div className="grid gap-4">
            {filteredSeeds.map(seed => (
              <div key={seed.id} className="border p-4 rounded shadow">
                <h2 className="font-semibold text-lg">{seed.breeder} – {seed.strain}</h2>
                <p className="text-sm text-gray-600">{seed.type} / {seed.sex} – {seed.packs} pack(s)</p>
                <p className="text-sm mt-1">{seed.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
