import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function SeedEntryForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, 'publicSeeds'), {
      ...form,
      userId: user.uid, // 🔥 Needed for Firestore rule
    });

    router.push('/search');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4 pt-24">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-center mb-6">CHRONIC SEED VAULT</h1>
        <h2 className="text-xl font-semibold text-center mb-6">Add a New Seed</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-left mb-1 font-semibold">Breeder</label>
          <input
            name="breeder"
            value={form.breeder}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mb-4"
          />

          <label className="block text-left mb-1 font-semibold">Strain</label>
          <input
            name="strain"
            value={form.strain}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mb-4"
          />

          <label className="block text-left mb-1 font-semibold">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="">Select type</option>
            <option value="photo">photo</option>
            <option value="auto">auto</option>
          </select>

          <label className="block text-left mb-1 font-semibold">Sex</label>
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="">Select sex</option>
            <option value="reg">reg</option>
            <option value="fem">fem</option>
          </select>

          <label className="block text-left mb-1 font-semibold">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-4"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Seed
          </button>
        </form>
      </div>
    </div>
  );
}
