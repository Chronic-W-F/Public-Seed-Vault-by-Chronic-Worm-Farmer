// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {isLogin ? 'Login to Your Vault' : 'Create an Account'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-600 text-white px-4 py-2 rounded w-full mt-4"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-sm text-center">
        {isLogin ? 'New here?' : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 underline">
          {isLogin ? 'Create an account' : 'Login instead'}
        </button>
      </p>
    </div>
  );
}
