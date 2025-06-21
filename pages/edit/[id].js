// pages/edit/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../../firebase';
import Navbar from '../../components/Navbar';

export default function EditSeedEntry() {
  const router = useRouter();
  const db = getFirestore(app);
  const { id } = router.query;

  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchSeed = async () => {
      const docRef = doc(db, 'publicSeeds', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      }
    };
    fetchSeed();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'publicSeeds', id);
    await updateDoc(docRef, form);
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 flex flex-col items-center">
      <Navbar />
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-2xl mt-6 text-center">
        <h1 className="text-4xl font-black mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-2xl font-bold mb-4">Edit Seed Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block font-semibold">Breeder</label>
            <input
              name="breeder"
              value={form.breeder}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Strain</label>
            <input
              name="strain"
              value={form.strain}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Type</label>
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Sex</label>
            <input
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
