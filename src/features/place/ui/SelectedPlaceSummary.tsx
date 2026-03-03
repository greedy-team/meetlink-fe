import { MapPin } from 'lucide-react';

import type { RecentPlaceItem } from '@/lib/recentPlaces';

type Props = {
  selected: RecentPlaceItem | null;
};

export function SelectedPlaceSummary({ selected }: Props) {
  if (!selected || !selected.address) {
    return null;
  }

  // name이 실제 주소명인지 판단
  const isDistinctName =
    !!selected.name &&
    selected.name !== selected.address &&
    selected.name !== selected.roadAddress &&
    selected.name !== selected.jibunAddress;

  // 타이틀: 실제 주소명일 경우 그대로 사용, 아닐 경우 도로명(또는 지번) 주소 사용
  const titleText = isDistinctName
    ? selected.name
    : selected.roadAddress || selected.jibunAddress || selected.address || '';

  // 서브 타이틀: 실제 주소명일 경우 도로명(또는 지번) 주소 사용, 아닐 경우 지번 주소(또는 전체 주소) 사용
  const subText = isDistinctName
    ? selected.roadAddress || selected.jibunAddress || selected.address || ''
    : selected.roadAddress && selected.jibunAddress
      ? selected.jibunAddress
      : selected.address || '';

  // 위아래 글자가 똑같으면 두 번 띄우지 않음
  const isSameText = titleText === subText;

  return (
    <section className="mt-8 pb-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-500">선택된 위치</h2>

      <div className="bg-greedy/10 flex items-center gap-3 rounded-xl px-4 py-4">
        <div className="bg-greedy/20 grid h-10 w-10 shrink-0 place-items-center rounded-full">
          <MapPin className="text-greedy h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-greedy-strong truncate text-base font-bold">{titleText}</div>
          {!isSameText && subText && (
            <div className="text-greedy-strong/80 mt-0.5 truncate text-sm font-medium">
              {subText}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
