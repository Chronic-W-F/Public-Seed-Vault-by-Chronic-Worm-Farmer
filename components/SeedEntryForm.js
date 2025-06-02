import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
        <div>
          <label className="block font-medium mb-1">Breeder Name</label>
          <input name="breeder" value={form.breeder} onChange={handleChange} required
            className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Strain Name</label>
          <input name="strain" value={form.strain} onChange={handleChange} required
            className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange}
            className="border p-2 rounded w-full">
            <option value="">Select Type</option>
            <option value="photo">Photoperiod</option>
            <option value="auto">Autoflower</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Sex</label>
          <select name="sex" value={form.sex} onChange={handleChange}
            className="border p-2 rounded w-full">
            <option value="">Select Sex</option>
            <option value="reg">Regular</option>
            <option value="fem">Feminized</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Pack Count</label>
          <input name="packs" type="number" min="1" value={form.packs} onChange={handleChange}
            className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Notes (Optional)</label>
          <textarea name="notes" value={form.notes} onChange={handleChange}
            className="border p-2 rounded w-full" rows={3} />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">➕ Add Entry</button>
      </form>
    </div>
  );
}
