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
  // address만 있는 경우(카카오/서버/로컬 저장 공통) 주소 일부를 요약해서 보여줌
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
  if (places.length === 0) {
    return (
      <section className="mt-6">
        {showTitle && <h2 className="mb-2 text-sm font-semibold text-gray-500">{title}</h2>}
        <div className="rounded-xl bg-gray-50 px-4 py-5 text-sm text-gray-500">
          저장된 최근 위치가 없습니다.
        </div>
      </section>
    );
  }

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
