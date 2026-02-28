import { MapPin } from 'lucide-react';

import type { RecentPlaceItem } from '@/lib/recentPlaces';

type Props = {
  places: RecentPlaceItem[];
  onSelect: (place: RecentPlaceItem) => void;
  makeTitle?: (address: string) => string;
  showTitle?: boolean;
  title?: string;
};

const defaultMakeTitle = (address: string) => {
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
          {title === '검색 결과' ? '검색 결과가 없습니다.' : '저장된 최근 위치가 없습니다.'}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      {showTitle && <h2 className="mb-2 text-sm font-semibold text-gray-500">{title}</h2>}

      <div className="divide-y divide-gray-200">
        {places.map((p, idx) => {
          const hasTwoLines = Boolean(p.roadAddress || p.jibunAddress);

          // 장소 이름 > 도로명 주소
          const titleText = p.placeName
            ? p.placeName
            : hasTwoLines
              ? p.roadAddress || p.jibunAddress
              : makeTitle(p.address);

          // 장소 이름 있을 경우 도로명 주소, 없을 경우 지번 주소
          const subText = p.placeName
            ? p.roadAddress || p.jibunAddress || p.address
            : hasTwoLines
              ? p.jibunAddress || p.address
              : p.address;

          return (
            <button
              key={`${p.address}-${idx}`}
              type="button"
              onClick={() => onSelect(p)}
              className={[
                'flex w-full items-start gap-3 px-2 py-4 text-left transition-colors',
                'hover:bg-gray-100',
                'active:scale-[0.98] active:bg-gray-100',
              ].join(' ')}
            >
              <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-gray-100">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold text-gray-900">{titleText}</div>
                <div className="truncate text-sm text-gray-500">{subText}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
