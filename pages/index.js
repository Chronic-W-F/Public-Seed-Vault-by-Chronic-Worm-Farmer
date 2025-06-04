import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function IndexPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
    packs: 1,
  });

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit");

  await addDoc(collection(db, 'publicSeeds'), {
  ...form,
  userId: user.uid,
  createdAt: new Date()
});
 setForm({ breeder: '', strain: '', type: '', sex: '', notes: '', packs: 1 });
    alert("Entry added!");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🌱 Public Seed Vault – Add Seeds</h1>

        {!user ? (
          <div className="text-center text-red-600 text-lg font-semibold mt-10">
            ⚠️ You must be logged in to submit. Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="breeder" placeholder="Breeder" value={form.breeder} onChange={handleChange} className="border p-2 rounded w-full text-sm" required />
            <input name="strain" placeholder="Strain" value={form.strain} onChange={handleChange} className="border p-2 rounded w-full text-sm" required />

            <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full text-sm">
              <option value="">Select Type</option>
              <option value="photo">Photoperiod</option>
              <option value="auto">Autoflower</option>
            </select>

            <select name="sex" value={form.sex} onChange={handleChange} className="border p-2 rounded w-full text-sm">
              <option value="">Select Sex</option>
              <option value="reg">Regular</option>
              <option value="fem">Feminized</option>
            </select>

            <input name="packs" type="number" min="1" value={form.packs} onChange={handleChange} className="border p-2 rounded w-full text-sm" placeholder="Pack Count" />
            <textarea name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full text-sm" rows={3} />

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm">➕ Add Entry</button>
          </form>
        )}
      </div>
    </>
  );
}
