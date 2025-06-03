// pages/index.js
import { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from '../components/Navbar';

export default function IndexPage() {
  const [user] = useAuthState(auth);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit");

    await addDoc(collection(db, 'publicSeeds'), {
      ...form,
      uid: user.uid,
      createdAt: new Date()
    });

    setForm({ breeder: '', strain: '', type: '', sex: '', notes: '', packs: 1 });
    alert("Entry added!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🌱 Public Seed Vault – Add Seeds</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <input name="packs" type="number" min="1" value={form.packs} onChange={handleChange} className="border p-2 rounded w-full" placeholder="Pack Count" />
        <textarea name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full" rows={3} />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">➕ Add Entry</button>
      </form>
    </div>
  );
}
