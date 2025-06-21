import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: 'photo',
    sex: 'reg',
    notes: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/login');
      if (id) {
        const docRef = doc(db, 'publicSeeds', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          alert('Seed not found.');
          router.push('/');
        }
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'publicSeeds', id);
    await updateDoc(docRef, form);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center flex flex-col items-center p-4">
      <Navbar />

      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-md mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-2xl font-bold mb-4">Edit Seed Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="font-bold block mb-1">Breeder</label>
            <input
              type="text"
              name="breeder"
              value={form.breeder}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Strain</label>
            <input
              type="text"
              name="strain"
              value={form.strain}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="photo">photo</option>
              <option value="auto">auto</option>
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Sex</label>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="reg">reg</option>
              <option value="fem">fem</option>
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
