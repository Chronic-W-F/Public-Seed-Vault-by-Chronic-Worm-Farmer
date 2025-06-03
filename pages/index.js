// pages/index.js (Data Entry Page)
import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from '../components/Navbar';

export default function PublicSeedVault() {
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: 1,
  });
  const [user] = useAuthState(auth);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setStatus('Adding...');
    try {
      await addDoc(collection(db, 'publicSeeds'), { ...form, uid: user.uid });
      setForm({ breeder: '', strain: '', type: '', sex: '', notes: '', packs: 1 });
      setStatus('✅ Entry added!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error adding entry.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🌱 Public Seed Vault – Add Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-2">
        <div>
          <label className="block font-medium mb-1">Breeder</label>
          <input name="breeder" value={form.breeder} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Strain</label>
          <input name="strain" value={form.strain} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Type</option>
            <option value="photo">Photoperiod</option>
            <option value="auto">Autoflower</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Sex</label>
          <select name="sex" value={form.sex} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Sex</option>
            <option value="reg">Regular</option>
            <option value="fem">Feminized</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Pack Count</label>
          <input name="packs" type="number" min="1" value={form.packs} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Notes (optional)</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full" rows={3} />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">➕ Add Entry</button>
        {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
      </form>
    </div>
  );
}
