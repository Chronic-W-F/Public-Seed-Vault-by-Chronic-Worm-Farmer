// pages/login.js
import { useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        Sign in with Google
      </button>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Sign in with Email
        </button>
      </form>
    </div>
  );
}
