import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getFirestore,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

export default function SeedEntryForm() {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const seedData = {
      ...form,
      userId: user.uid,
    };

    await addDoc(collection(db, 'publicSeeds'), seedData);
    setForm({
      breeder: '',
      strain: '',
      type: '',
      sex: '',
      notes: '',
    });
    alert('Seed added!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="font-bold block mb-1">Breeder</label>
        <input
          type="text"
          name="breeder"
          value={form.breeder}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
        />
      </div>

      <div>
        <label className="font-bold block mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Unknown</option>
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
        >
          <option value="">Unknown</option>
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
        Add Seed
      </button>
    </form>
  );
}
