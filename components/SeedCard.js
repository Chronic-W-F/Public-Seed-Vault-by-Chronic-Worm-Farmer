import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SeedCard({ seed, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-md w-full transition hover:shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-green-800">{seed.strain}</h3>
      <p><strong>Breeder:</strong> {seed.breeder}</p>
      <p><strong>Type:</strong> {seed.type}</p>
      <p><strong>Sex:</strong> {seed.sex}</p>
      {seed.notes && <p><strong>Notes:</strong> {seed.notes}</p>}

      <div className="mt-3 flex justify-end space-x-3">
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
