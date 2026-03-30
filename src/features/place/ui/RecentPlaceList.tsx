import { MapPin } from 'lucide-react';

import type { RecentPlaceItem } from '@/lib/recentPlaces';

type Props = {
  places: RecentPlaceItem[];
  onSelect: (place: RecentPlaceItem) => void;
  showTitle?: boolean;
  title?: string;
};

export function RecentPlaceList({
  places,
  onSelect,
  showTitle = true,
  title = '최근 위치',
}: Props) {
  if (places.length === 0) {
    return (
      <section className="mt-6">
        {showTitle && <h2 className="mb-2 text-sm font-semibold text-gray-500">{title}</h2>}
        <div className="rounded-xl bg-gray-50 px-4 py-5 text-sm text-gray-500">
          {title === '검색 결과' ? '검색 결과가 없어요' : '저장된 최근 위치가 없어요'}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      {showTitle && <h2 className="mb-2 text-sm font-semibold text-gray-500">{title}</h2>}

      <div className="divide-y divide-gray-200">
        {places.map((p, idx) => {
          // name이 실제 주소명인지 판단
          const isDistinctName =
            p.name && p.name !== p.address && p.name !== p.roadAddress && p.name !== p.jibunAddress;

          // 타이틀: 실제 주소명일 경우 그대로 사용, 아닐 경우 도로명(또는 지번) 주소 사용
          const titleText = isDistinctName
            ? p.name
            : p.roadAddress || p.jibunAddress || p.address || '';

          // 서브 타이틀: 실제 주소명일 경우 도로명(또는 지번) 주소 사용, 아닐 경우 지번 주소(또는 전체 주소) 사용
          const subText = isDistinctName
            ? p.roadAddress || p.jibunAddress || p.address || ''
            : p.roadAddress && p.jibunAddress
              ? p.jibunAddress
              : p.address || '';

          const isSameText = titleText === subText;

          return (
            <button
              key={`${p.address}-${idx}`}
              type="button"
              onClick={() => onSelect(p)}
              className={[
                'flex w-full cursor-pointer items-center gap-3 px-2 py-4 text-left transition-colors',
                'hover:bg-gray-100',
                'active:scale-[0.98] active:bg-gray-100',
              ].join(' ')}
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-100">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold text-gray-900">{titleText}</div>
                {/* 글자가 다를 때만 서브(지번) 보여줌 */}
                {!isSameText && subText && (
                  <div className="truncate text-sm text-gray-500">{subText}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
