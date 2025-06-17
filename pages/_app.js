import '../styles/globals.css'; // adjust path if your CSS is named differently
import BackgroundLayout from '../components/BackgroundLayout';

export default function App({ Component, pageProps }) {
  return (
    <BackgroundLayout>
      <Component {...pageProps} />
    </BackgroundLayout>
  );
}
