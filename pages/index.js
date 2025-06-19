import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    breeder: '',
    strain: '',
    type: '',
    sex: '',
    notes: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit");

    try {
      await addDoc(collection(db, 'publicSeeds'), {
        ...form,
        userId: user.uid,
        createdAt: new Date(),
      });
      setForm({
        breeder: '',
        strain: '',
        type: '',
        sex: '',
        notes: '',
      });
      alert("Entry added!");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/vault-bg.jpg')] bg-cover bg-center p-4">
      <Navbar />

      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg mt-6">
        <h1 className="text-4xl font-black text-center mb-2">CHRONIC SEED VAULT</h1>
        <h2 className="text-xl font-semibold text-center mb-6">
          🌱 Public Seed Vault – Add Seeds
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Breeder</label>
            <input
              type="text"
              name="breeder"
              value={form.breeder}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Strain</label>
            <input
              type="text"
              name="strain"
              value={form.strain}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-semibold mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="Photo">Photo</option>
                <option value="Auto">Auto</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block font-semibold mb-1">Sex</label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Sex</option>
                <option value="Reg">Reg</option>
                <option value="Fem">Fem</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
}
