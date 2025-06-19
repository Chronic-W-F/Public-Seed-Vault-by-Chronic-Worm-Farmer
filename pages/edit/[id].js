import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import Navbar from '../../components/Navbar';

export default function EditSeedPage() {
  const router = useRouter();
  const { id } = router.query;

  const db = getFirestore(app);
  const auth = getAuth(app);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSeed = async () => {
      if (!id || !user) return;
      const ref = doc(db, 'publicSeeds', id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setForm(snapshot.data());
      } else {
        alert('Seed not found');
        router.push('/');
      }
    };
    fetchSeed();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ref = doc(db, 'publicSeeds', id);
    await updateDoc(ref, form);
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 flex flex-col items-center">
      <Navbar />
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-3xl mt-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Edit Seed Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {['breeder', 'strain', 'type', 'sex', 'notes', 'packs'].map((field) => (
            <div key={field}>
              <label className="block font-semibold capitalize">{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
