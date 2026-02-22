import { ParticipantChips } from './ParticipantChips';
import { PlaceCards } from './PlaceCards';

import type { RecommendPlace } from '@/types/meetingTypes';

type PlaceRecommendOverlayProps = {
  places: RecommendPlace[];

  selectedRank: number;
  onSelectRank: (rank: number) => void;

  selectedNickName: string | null;
  onChangeSelectedNickName: (next: string | null) => void;

  bottomCtaHeightPx?: number;
};

export function PlaceRecommendOverlay({
  places,
  selectedRank,
  onSelectRank,
  selectedNickName,
  onChangeSelectedNickName,
  bottomCtaHeightPx = 64,
}: PlaceRecommendOverlayProps) {
  const selectedPlace = places.find((p) => p.rank === selectedRank);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 상단 칩 */}
      <div className="pointer-events-auto px-4 pt-2">
        {selectedPlace && (
          <ParticipantChips
            movements={selectedPlace.participantMovementList}
            selectedNickName={selectedNickName}
            onChangeSelected={onChangeSelectedNickName}
          />
        )}
      </div>

      {/* 하단 카드 */}
      <div
        className="pointer-events-auto absolute inset-x-0 bottom-0 px-4"
        style={{ paddingBottom: bottomCtaHeightPx + 2 }}
      >
        <PlaceCards places={places} selectedRank={selectedRank} onSelect={onSelectRank} />
      </div>
    </div>
  );
}
