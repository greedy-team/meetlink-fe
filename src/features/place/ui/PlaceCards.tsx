import type { RecommendPlace } from '@/types/meetingTypes';

type PlaceCardsProps = {
  places: RecommendPlace[];
  selectedRank: number;
  onSelect: (rank: number) => void;
};

export function PlaceCards({ places, selectedRank, onSelect }: PlaceCardsProps) {
  const sorted = [...places].sort((a, b) => a.rank - b.rank);

  return (
    <section className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sorted.map((place) => {
          const isSelected = place.rank === selectedRank;
          const showBadge = place.rank === 1;

          return (
            <button
              key={place.rank}
              type="button"
              onClick={() => onSelect(place.rank)}
              className={[
                'min-w-70 shrink-0 rounded-2xl border-2 bg-white px-4 py-4 text-left shadow-sm first:ml-4 last:mr-4',
                isSelected ? 'border-greedy' : 'border-gray-200',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-xl font-semibold text-gray-900">{place.placeName}</div>
                {showBadge && (
                  <span className="bg-greedy rounded-full px-2 py-1 text-xs font-semibold text-white">
                    추천
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-500">{place.placeAddress}</div>

              <div className="mt-4 flex items-end justify-between">
                <div className="text-greedy text-base font-semibold">
                  평균 {place.averageTime}분
                </div>
                <div className="text-sm text-gray-500">최대 {place.maxTime}분</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
