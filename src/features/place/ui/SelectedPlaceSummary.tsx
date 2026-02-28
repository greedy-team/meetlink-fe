import { MapPin } from 'lucide-react';

import type { RecentPlaceItem } from '@/lib/recentPlaces';

type Props = {
  selected: RecentPlaceItem | null;
};

export function SelectedPlaceSummary({ selected }: Props) {
  if (!selected || !selected.address) {
    return null;
  }

  const hasTwoLines = Boolean(selected.roadAddress || selected.jibunAddress);
  const titleText = selected.placeName
    ? selected.placeName
    : hasTwoLines
      ? selected.roadAddress || selected.jibunAddress
      : selected.address;

  return (
    <section className="mt-8 pb-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-500">선택된 위치</h2>

      <div className="bg-greedy/30 flex items-center gap-3 rounded-xl px-4 py-5">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-white">
          <MapPin className="text-greedy h-4 w-4" />
        </div>
        <span className="text-greedy-strong text-base font-semibold break-keep">{titleText}</span>
      </div>
    </section>
  );
}
