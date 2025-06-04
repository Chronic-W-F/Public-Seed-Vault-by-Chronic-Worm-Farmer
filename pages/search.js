import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../firebase';

export default function SearchPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = async () => {
    if (!user || !searchTerm) return;

    const q = query(
      collection(db, 'seeds'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    const filtered = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(entry =>
        entry.breeder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.strain?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setResults(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Your Seed Vault</h1>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <button onClick={handleLogout} className="text-red-500 underline text-sm">
          Logout
        </button>
        <button
          onClick={() => router.push('/data-entry')}
          className="text-blue-500 underline text-sm"
        >
          Back to Data Entry
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by breeder or strain"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Search
      </button>

      <div className="mt-6">
        {results.length === 0 && searchTerm && (
          <p>No results found.</p>
        )}
        {results.map((entry) => (
          <div key={entry.id} className="mb-4 p-4 bg-white rounded shadow">
            <p><strong>Breeder:</strong> {entry.breeder}</p>
            <p><strong>Strain:</strong> {entry.strain}</p>
            <p><strong>Type:</strong> {entry.type}</p>
            <p><strong>Sex:</strong> {entry.sex}</p>
            <p><strong>Notes:</strong> {entry.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
