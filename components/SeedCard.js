import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SeedCard({ seed, onDelete }) {
  return (
    <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-300 p-4 w-full relative transition hover:shadow-xl">
      <h3 className="text-xl font-black mb-2 text-green-800">{seed.strain}</h3>
      <p className="text-gray-700"><strong>Breeder:</strong> {seed.breeder}</p>
      <p className="text-gray-700"><strong>Type:</strong> {seed.type}</p>
      <p className="text-gray-700"><strong>Sex:</strong> {seed.sex}</p>
      {seed.notes && <p className="text-gray-700"><strong>Notes:</strong> {seed.notes}</p>}

      <div className="absolute top-2 right-2 flex space-x-3">
        <Link href={`/edit/${seed.id}`}>
          <Pencil className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
        </Link>
        <Trash2
          onClick={() => onDelete(seed.id)}
          className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer"
        />
      </div>
    </div>
  );
}
