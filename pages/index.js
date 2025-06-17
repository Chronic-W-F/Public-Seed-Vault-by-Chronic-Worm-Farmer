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
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🌱 Public Seed Vault – Add Seeds</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block font-semibold">Breeder</label>
            <input
              type="text"
              name="breeder"
              value={form.breeder}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Strain</label>
            <input
              type="text"
              name="strain"
              value={form.strain}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="Photo">Photo</option>
              <option value="Auto">Auto</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Sex</label>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Sex</option>
              <option value="Reg">Reg</option>
              <option value="Fem">Fem</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Entry
          </button>
        </form>
      </div>
    </>
  );
}
