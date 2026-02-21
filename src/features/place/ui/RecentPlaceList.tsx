import { MapPin } from 'lucide-react';

import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

type Props = {
  places: UpdateMyStartPlaceRequest[];
  onSelect: (place: UpdateMyStartPlaceRequest) => void;
  makeTitle?: (address: string) => string;
  showTitle?: boolean;
  title?: string;
};

const defaultMakeTitle = (address: string) => {
  // UI용 임시: 목데이터라 title 필드가 없어서 임시로 앞 3~4토큰만 잘라서 제목으로 사용. api 연결하면 수정 예정
  const tokens = address.trim().split(/\s+/);
  return tokens.slice(0, Math.min(tokens.length, 4)).join(' ');
};

export function RecentPlaceList({
  places,
  onSelect,
  makeTitle = defaultMakeTitle,
  showTitle = true,
  title = '최근 위치',
}: Props) {
  if (places.length === 0) return null;

  return (
    <section className="mt-6">
      {showTitle && <h2 className="mb-2 text-sm font-semibold text-gray-500">{title}</h2>}

      <div className="divide-y divide-gray-200">
        {places.map((p, idx) => {
          const titleText = makeTitle(p.address);

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
                <div className="truncate text-base font-semibold text-gray-900">{titleText}</div>
                <div className="truncate text-sm text-gray-500">{p.address}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
