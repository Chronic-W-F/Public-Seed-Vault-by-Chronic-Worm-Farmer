// components/SeedCard.js
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SeedCard({ seed, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 p-4 w-full relative">
      <h3 className="text-xl font-extrabold mb-2">{seed.strain}</h3>
      <p><strong>Breeder:</strong> {seed.breeder}</p>
      <p><strong>Type:</strong> {seed.type}</p>
      <p><strong>Sex:</strong> {seed.sex}</p>
      {seed.notes && <p><strong>Notes:</strong> {seed.notes}</p>}

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
