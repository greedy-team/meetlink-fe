import { MapPin } from 'lucide-react';

export function CenterPin() {
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      <div className="bg-greedy grid h-12 w-12 place-items-center rounded-full shadow-lg">
        <MapPin className="h-6 w-6 text-white" />
      </div>
      {/* 핀이 꽂히는 바닥 점 */}
      <div className="bg-greedy mt-1.5 h-2.5 w-2.5 rounded-full shadow-sm" />
    </div>
  );
}
