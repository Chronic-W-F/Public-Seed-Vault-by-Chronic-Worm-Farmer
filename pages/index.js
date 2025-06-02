import SeedEntryForm from '../components/SeedEntryForm';

export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌱 Public Seed Vault</h1>
      <SeedEntryForm />
    </div>
  );
}
