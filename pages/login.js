import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, provider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
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
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/publicvault-bg.png')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? '🔐 Login to Your Vault' : '📝 Create an Account'}
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

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-800">
          <h2 className="font-semibold text-base mb-2">📲 Save to Your Home Screen</h2>
          <ul className="list-disc list-inside mb-3 space-y-1">
            <li><strong>Android:</strong> Tap the <strong>⋮</strong> menu in Chrome and select <em>“Add to Home screen.”</em></li>
            <li><strong>iPhone:</strong> Tap the <strong>Share</strong> icon in Safari, then choose <em>“Add to Home Screen.”</em></li>
          </ul>

          <h3 className="font-semibold mb-1">💚 Donations Welcome</h3>
          <p>If you're enjoying the Chronic Seed Vault and want to support future development:</p>
          <p className="text-green-600 font-bold mt-1">Cash App: $DaveVandergriff</p>
          <p className="italic text-xs">(Please put “dev” in the comment section)</p>
        </div>
      </div>
    </div>
  );
}
