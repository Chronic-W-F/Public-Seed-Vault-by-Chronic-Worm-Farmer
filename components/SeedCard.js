import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SeedCard({ seed, onDelete }) {
  return (
    <div className="rounded-xl border-4 border-purple-700 bg-white p-4 shadow-xl w-full transition-all hover:scale-[1.02] hover:border-green-600">
      <div className="text-left space-y-1">
        <h3 className="text-2xl font-extrabold text-purple-800">{seed.strain}</h3>
        <p><strong>Breeder:</strong> {seed.breeder}</p>
        <p><strong>Type:</strong> {seed.type}</p>
        <p><strong>Sex:</strong> {seed.sex}</p>
        {seed.notes && <p><strong>Notes:</strong> {seed.notes}</p>}
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <Link href={`/edit/${seed.id}`}>
          <Pencil className="h-6 w-6 text-blue-600 hover:text-blue-800 cursor-pointer" />
        </Link>
        <Trash2
          onClick={() => onDelete(seed.id)}
          className="h-6 w-6 text-red-600 hover:text-red-800 cursor-pointer"
        />
      </div>
    </div>
  );
}
