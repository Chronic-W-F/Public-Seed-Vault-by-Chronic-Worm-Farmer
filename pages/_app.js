import '../styles/globals.css';
import BackgroundLayout from '../components/BackgroundLayout';

export default function App({ Component, pageProps }) {
  return (
    <BackgroundLayout>
      <Component {...pageProps} />
    </BackgroundLayout>
  );
}
