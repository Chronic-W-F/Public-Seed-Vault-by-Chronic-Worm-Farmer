// /components/Login.js

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded shadow mt-10 text-center">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login with Email</button>
      </form>
      <div className="my-4">or</div>
      <button onClick={handleGoogleLogin} className="bg-red-600 text-white px-4 py-2 rounded w-full">
        Sign in with Google
      </button>
    </div>
  );
}
