// Starting scaffold for Public Seed Vault App
// Framework: Next.js + TailwindCSS + Firebase
// This will be stylized, support public entries, and allow editing/deletion

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function PublicSeedVault() {
  const [seeds, setSeeds] = useState([]);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: 1,
  });

  const fetchSeeds = async () => {
    const snapshot = await getDocs(collection(db, 'publicSeeds'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSeeds(data);
  };

  useEffect(() => {
    fetchSeeds();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'publicSeeds'), form);
    setForm({ breeder: '', strain: '', type: '', sex: '', notes: '', packs: 1 });
    fetchSeeds();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'publicSeeds', id));
    fetchSeeds();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

