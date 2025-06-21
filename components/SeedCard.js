import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SeedCard({ seed, onDelete }) {
  return (
    <div className="rounded-xl border shadow-md bg-white/90 p-4 w-full transition-all hover:shadow-lg">
      <div className="text-left space-y-1">
        <h3 className="text-xl font-bold text-green-800">{seed.strain}</h3>
        <p><span className="font-semibold">Breeder:</span> {seed.breeder}</p>
        <p><span className="font-semibold">Type:</span> {seed.type}</p>
        <p><span className="font-semibold">Sex:</span> {seed.sex}</p>
        {seed.notes && (
          <p><span className="font-semibold">Notes:</span> {seed.notes}</p>
        )}
      </div>

      <div className="mt-2 flex justify-end space-x-3">
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
