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
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';
import SeedCard from '../components/SeedCard';

export default function SearchPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [seeds, setSeeds] = useState([]);
  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, 'publicSeeds'),
          where('userId', '==', user.uid),
          orderBy('breeder'),
          orderBy('strain') // ⚠️ May require a composite index in Firebase
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("🌱 All fetched seeds:", data);
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
      seeds.filter((s) => {
        const breeder = (s.breeder || '').toLowerCase();
        const strain = (s.strain || '').toLowerCase();
        const type = (s.type || '').toLowerCase();
        const sex = (s.sex || '').toLowerCase();
        const notes = (s.notes || '').toLowerCase();

        return (
          breeder.includes(lower) ||
          strain.includes(lower) ||
          type.includes(lower) ||
          sex.includes(lower) ||
          notes.includes(lower)
        );
      })
    );
  }, [search, seeds]);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this entry?');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'publicSeeds', id));
    setSeeds(seeds.filter((s) => s.id !== id));
  };

  const handleDonateClick = async () => {
    try {
      await navigator.clipboard.writeText('$DaveVandergriff');
      setCopied(true);
      window.location.href = 'cashapp://$DaveVandergriff';
    } catch (err) {
      alert('Copied to clipboard, but unable to open CashApp.');
    }
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 flex flex-col items-center">
      <Navbar currentPage="search" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-5xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-2xl font-bold mb-4">Search Your Seed Vault</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by breeder, strain, type, sex, or notes..."
          className="mb-6 w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {filteredSeeds.length === 0 ? (
          <p className="text-gray-700">No seeds match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSeeds.map((seed) => {
              console.log("🔎 Attempting to render:", seed);
              try {
                const safeSeed = {
                  id: seed.id,
                  strain: seed.strain || 'Unnamed Strain',
                  breeder: seed.breeder || 'Unknown',
                  type: seed.type || 'N/A',
                  sex: seed.sex || 'N/A',
                  notes: seed.notes || 'None',
                };

                return (
                  <SeedCard
                    key={safeSeed.id}
                    seed={safeSeed}
                    onDelete={handleDelete}
                  />
                );
              } catch (err) {
                console.warn("❌ Failed to render seed:", seed, err);
                return (
                  <div
                    key={seed.id}
                    className="bg-red-100 text-red-900 border border-red-400 p-4 rounded"
                  >
                    ⚠️ Could not render this seed. Check field data.
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Donate Section */}
        <div className="mt-12 text-center">
          <p className="mb-2 text-lg font-semibold">Enjoying the app?</p>
          <p className="mb-4 text-sm">Tap below to donate via CashApp and support more grow tools!</p>
          <button
            onClick={handleDonateClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            💸 Donate via CashApp
          </button>
          {copied && (
            <p className="mt-2 text-sm text-green-700">
              Copied <strong>$DaveVandergriff</strong> to clipboard!
            </p>
          )}
          <p className="mt-2 text-xs text-gray-700 italic">
            Don’t forget to <strong>add "dev" in the comment</strong> when you donate!
          </p>
        </div>
      </div>
    </div>
  );
}
