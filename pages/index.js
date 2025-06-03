// pages/index.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AuthForm from '../components/AuthForm';
import Navbar from '../components/Navbar';
import SeedEntryForm from '../components/SeedEntryForm';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <SeedEntryForm user={user} />
    </div>
  );
}
