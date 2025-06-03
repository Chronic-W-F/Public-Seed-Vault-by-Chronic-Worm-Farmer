// /pages/index.js

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Login from '../components/Login';
import Navbar from '../components/Navbar';

export default function Home() {
  const [user, setUser] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: 1,
  });

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchSeeds(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchSeeds = async (uid) => {
    const q = query(collection(db, 'publicSeeds'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSeeds(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const data = {
      ...form,
      userId: user.uid,
    };

    await addDoc(collection(db, 'publicSeeds'), data);
    setForm({ breeder: '', strain: '', type: '', sex: '', notes: '', packs: 1 });
    fetchSeeds(user.uid);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'publicSeeds', id));
    fetchSeeds(user.uid);
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🌱 Public Seed Vault</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input name="breeder" placeholder="Breeder" value={form.breeder} onChange={handleChange} className="border p-2 rounded w-full" required />
        <input name="strain" placeholder="Strain" value={form.strain} onChange={handleChange} className="border p-2 rounded w-full" required />
        <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Select Type</option>
          <option value="photo">Photoperiod</option>
          <option value="auto">Autoflower</option>
        </select>
        <select name="sex" value={form.sex} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Select Sex</option>
          <option value="reg">Regular</option>
          <option value="fem">Feminized</option>
        </select>
        <input name="packs" type="number" min="1" value={form.packs} onChange={handleChange} className="border p-2 rounded w-full" />
        <textarea name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full" rows={3} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">➕ Add Entry</button>
      </form>

      <div className="grid gap-4">
        {seeds.map((seed) => (
          <div key={seed.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{seed.breeder} – {seed.strain}</h2>
            <p className="text-sm text-gray-600">{seed.type} / {seed.sex} – {seed.packs} pack(s)</p>
            <p className="text-sm mt-1">{seed.notes}</p>
            <button
              onClick={() => handleDelete(seed.id)}
              className="mt-2 text-red-600 text-sm underline hover:text-red-800"
            >🗑️ Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
