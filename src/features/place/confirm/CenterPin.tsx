import { MapPin } from 'lucide-react';

export function CenterPin() {
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="bg-greedy grid h-16 w-16 place-items-center rounded-full shadow-lg">
        <MapPin className="h-7 w-7 text-white" />
      </div>
      <div className="bg-greedy mx-auto mt-2 h-3 w-3 rounded-full" />
    </div>
  );
}
