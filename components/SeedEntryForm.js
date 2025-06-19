import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function SeedEntryForm({ user }) {
  const [seeds, setSeeds] = useState([]);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: '1',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadSeeds = async () => {
      const q = query(collection(db, 'publicSeeds'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeeds(data);
    };
    if (user) loadSeeds();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedForm = {
      ...form,
      breeder: form.breeder.trim(),
      strain: form.strain.trim(),
      notes: form.notes.trim(),
      uid: user.uid,
    };

    try {
      await addDoc(collection(db, 'publicSeeds'), trimmedForm);

      // Clear form + show success
      setForm({
        breeder: '',
        strain: '',
        type: '',
        sex: '',
        notes: '',
        packs: '1',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Error adding seed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <input
        type="text"
        name="breeder"
        value={form.breeder}
        onChange={handleChange}
        placeholder="Breeder"
        className="w-full p-2 rounded border border-gray-300"
        required
      />
      <input
        type="text"
        name="strain"
        value={form.strain}
        onChange={handleChange}
        placeholder="Strain"
        className="w-full p-2 rounded border border-gray-300"
        required
      />
      <div className="flex space-x-2">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="flex-1 p-2 rounded border border-gray-300"
        >
          <option value="">Select Type</option>
          <option value="photo">Photo</option>
          <option value="auto">Auto</option>
        </select>
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          required
          className="flex-1 p-2 rounded border border-gray-300"
        >
          <option value="">Select Sex</option>
          <option value="reg">Reg</option>
          <option value="fem">Fem</option>
        </select>
      </div>
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes (optional)"
        className="w-full p-2 rounded border border-gray-300"
      />
      <input
        type="number"
        name="packs"
        value={form.packs}
        onChange={handleChange}
        className="w-full p-2 rounded border border-gray-300"
        min="1"
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        ➕ Add Entry
      </button>

      {success && (
        <div className="mt-4 text-center text-green-700 font-bold text-xl">
          🔥 Locked In 🔥
        </div>
      )}
    </form>
  );
}
