import { MapPin } from 'lucide-react';

import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

type Props = {
  places: UpdateMyStartPlaceRequest[];
  onSelect: (place: UpdateMyStartPlaceRequest) => void;
  makeTitle?: (address: string) => string;
};

const defaultMakeTitle = (address: string) => {
  // UI-only 임시: "서울 강남구 역삼동 ..." → 앞 3~4토큰만 title로
  const tokens = address.trim().split(/\s+/);
  return tokens.slice(0, Math.min(tokens.length, 4)).join(' ');
};

export function RecentPlaceList({ places, onSelect, makeTitle = defaultMakeTitle }: Props) {
  if (places.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-semibold text-gray-500">최근 위치</h2>

      <div className="divide-y divide-gray-200">
        {places.map((p, idx) => {
          const title = makeTitle(p.address);

          return (
            <button
              key={`${p.address}-${idx}`}
              type="button"
              onClick={() => onSelect(p)}
              className="flex w-full items-start gap-3 py-4 text-left"
            >
              <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-gray-100">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold text-gray-900">{title}</div>
                <div className="truncate text-sm text-gray-500">{p.address}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
