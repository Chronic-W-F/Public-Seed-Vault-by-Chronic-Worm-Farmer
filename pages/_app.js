import '../styles/globals.css';
import Head from 'next/head';
import BackgroundLayout from '../components/BackgroundLayout';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Chronic Seed Vault</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <BackgroundLayout>
        <Component {...pageProps} />
      </BackgroundLayout>
    </>
  );
}
