import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function SeedEntryForm() {
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
    await addDoc(collection(db, 'publicSeeds'), form);
    setForm({ breeder: '', strain: '', type: '', sex: '', notes: '', packs: 1 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <label className="font-medium block">Breeder</label>
      <input name="breeder" value={form.breeder} onChange={handleChange} className="border p-2 rounded w-full" required />

      <label className="font-medium block">Strain</label>
      <input name="strain" value={form.strain} onChange={handleChange} className="border p-2 rounded w-full" required />

      <label className="font-medium block">Type</label>
      <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full">
        <option value="">Select Type</option>
        <option value="photo">Photoperiod</option>
        <option value="auto">Autoflower</option>
      </select>

      <label className="font-medium block">Sex</label>
      <select name="sex" value={form.sex} onChange={handleChange} className="border p-2 rounded w-full">
        <option value="">Select Sex</option>
        <option value="reg">Regular</option>
        <option value="fem">Feminized</option>
      </select>

      <label className="font-medium block">Pack Count</label>
      <input
        name="packs"
        type="number"
        min="1"
        value={form.packs}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <label className="font-medium block">Notes <span className="text-gray-400">(optional)</span></label>
      <textarea name="notes" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full" rows={3} />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">➕ Add Entry</button>
    </form>
  );
}
