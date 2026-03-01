import { MapPin } from 'lucide-react';

import type { RecentPlaceItem } from '@/lib/recentPlaces';
import { loadRecentPlaces } from '@/lib/recentPlaces';

type Props = {
  selected: RecentPlaceItem | null;
};

export function SelectedPlaceSummary({ selected }: Props) {
  if (!selected || !selected.address) {
    return null;
  }

  // 서버에서 온 데이터에 로컬 데이터(장소명) 덧씌워주기
  const recents = loadRecentPlaces();
  const richPlace = recents.find((p) => p.address === selected.address) || selected;

  const hasTwoLines = Boolean(richPlace.roadAddress || richPlace.jibunAddress);

  // 장소명 > 도로명 > 지번 순
  const titleText = richPlace.placeName
    ? richPlace.placeName
    : hasTwoLines
      ? richPlace.roadAddress || richPlace.jibunAddress
      : richPlace.address;

  const subText = richPlace.placeName
    ? richPlace.roadAddress || richPlace.jibunAddress || richPlace.address
    : hasTwoLines
      ? richPlace.jibunAddress || richPlace.address
      : richPlace.address;

  // 타이틀과 서브 텍스트가 똑같으면 두 번 띄우지 않음
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
