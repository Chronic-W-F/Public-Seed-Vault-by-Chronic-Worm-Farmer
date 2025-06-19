import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';

export default function SearchPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    packs: 1,
    notes: '',
  });

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
    setSeeds(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'publicSeeds', id));
    fetchSeeds(user.uid);
  };

  const handleEditClick = (seed) => {
    setEditingId(seed.id);
    setEditForm({
      breeder: seed.breeder,
      strain: seed.strain,
      type: seed.type,
      sex: seed.sex,
      packs: seed.packs,
      notes: seed.notes,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await updateDoc(doc(db, 'publicSeeds', editingId), editForm);
    setEditingId(null);
    fetchSeeds(user.uid);
  };

  const filteredSeeds = seeds.filter((seed) =>
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
          {filteredSeeds.length > 0 ? (
            filteredSeeds.map((seed) => (
              <div key={seed.id} className="border p-4 rounded shadow bg-white/90 text-left">
                {editingId === seed.id ? (
                  <>
                    <input
                      name="breeder"
                      value={editForm.breeder}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      name="strain"
                      value={editForm.strain}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      name="sex"
                      value={editForm.sex}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      name="packs"
                      type="number"
                      min="1"
                      value={editForm.packs}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <textarea
                      name="notes"
                      value={editForm.notes}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleEditSave}
                        className="text-green-600 underline text-sm"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 underline text-sm"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold text-lg">
                      {seed.breeder} – {seed.strain}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {seed.type} / {seed.sex} – {seed.packs} pack(s)
                    </p>
                    <p className="text-sm mt-1">{seed.notes}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <button
                        onClick={() => handleEditClick(seed)}
                        className="text-blue-600 underline"
                      >
                        📝 Edit
                      </button>
                      <button
                        onClick={() => handleDelete(seed.id)}
                        className="text-red-600 underline"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
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
