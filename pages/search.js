import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { app } from '../firebase';

export default function SearchPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editForm, setEditForm] = useState({
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
  }, [auth, router]);

  useEffect(() => {
    if (user && searchTerm.trim().length > 0) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = async () => {
    if (!user || !searchTerm) return;

    const q = query(
      collection(db, 'publicSeeds'),
      where('userId', '==', user.uid)
    );

    const snapshot = await getDocs(q);
    const term = searchTerm.toLowerCase();

    const filtered = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(entry =>
        entry.breeder?.toLowerCase().includes(term) ||
        entry.strain?.toLowerCase().includes(term) ||
        entry.type?.toLowerCase().includes(term) ||
        entry.sex?.toLowerCase().includes(term) ||
        entry.notes?.toLowerCase().includes(term)
      );

    console.log("Current user ID:", user?.uid);
    console.log("Fetched documents:", snapshot.docs.map(doc => doc.data()));

    setResults(filtered);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'publicSeeds', id));
    setResults(results.filter(entry => entry.id !== id));
  };

  const handleEditClick = (entry) => {
    setEditEntryId(entry.id);
    setEditForm({
      breeder: entry.breeder,
      strain: entry.strain,
      type: entry.type,
      sex: entry.sex,
      notes: entry.notes,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await updateDoc(doc(db, 'publicSeeds', editEntryId), editForm);
    setEditEntryId(null);
    handleSearch(); // Refresh results
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Your Seed Vault</h1>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <button onClick={handleLogout} className="text-red-500 underline text-sm">
          Logout
        </button>
        <button
          onClick={() => router.push('/')}
          className="text-blue-500 underline text-sm"
        >
          Back to Data Entry
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by breeder, strain, type, sex, or notes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <div className="mt-6">
        {results.length === 0 && searchTerm && <p>No results found.</p>}
        {results.map((entry) => (
          <div key={entry.id} className="mb-4 p-4 bg-white rounded shadow">
            {editEntryId === entry.id ? (
              <>
                <input
                  name="breeder"
                  value={editForm.breeder}
                  onChange={handleEditChange}
                  className="block w-full mb-2 p-1 border rounded"
                  placeholder="Breeder"
                />
                <input
                  name="strain"
                  value={editForm.strain}
                  onChange={handleEditChange}
                  className="block w-full mb-2 p-1 border rounded"
                  placeholder="Strain"
                />
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  className="block w-full mb-2 p-1 border rounded"
                >
                  <option value="">Select Type</option>
                  <option value="Photo">Photo</option>
                  <option value="Auto">Auto</option>
                </select>
                <select
                  name="sex"
                  value={editForm.sex}
                  onChange={handleEditChange}
                  className="block w-full mb-2 p-1 border rounded"
                >
                  <option value="">Select Sex</option>
                  <option value="Reg">Reg</option>
                  <option value="Fem">Fem</option>
                </select>
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  className="block w-full mb-2 p-1 border rounded"
                  placeholder="Notes"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditSave}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditEntryId(null)}
                    className="text-gray-600 underline"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Breeder:</strong> {entry.breeder}</p>
                <p><strong>Strain:</strong> {entry.strain}</p>
                <p><strong>Type:</strong> {entry.type}</p>
                <p><strong>Sex:</strong> {entry.sex}</p>
                <p><strong>Notes:</strong> {entry.notes}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEditClick(entry)}
                    className="text-blue-600 underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
