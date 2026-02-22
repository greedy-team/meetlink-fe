import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { LatLngMap } from './LatLngMap';
import { RecommendItem } from './RecommendItem';

import { type RecommendPlace, type RecommendTime } from '@/types/meetingTypes';
interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime?: RecommendTime;
  bestPlace?: RecommendPlace;
  className?: string;
}

// UI 확인용 목데이터
const MOCK_BEST_PLACE = {
  placeName: '서울역',
  placeAddress: '서울특별시 용산구 한강대로 405',
  latitude: '37.5546',
  longitude: '126.9706',
  rank: 1,
  averageTime: 30,
  maxTime: 45,
  participantMovementList: [],
} satisfies RecommendPlace;

export function RecommendSummaryCard({
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  //bestTime,
  bestPlace,
  className,
}: RecommendSummaryCardProps) {
  const navigate = useNavigate();
  const handleGoToButton = (url: string) => {
    navigate(url);
  };

  if (!isTimeRecommendEnabled && !isPlaceRecommendEnabled) {
    return null; // 혹시나 방지
  }

  // 목데이터 없애면 삭제
  const placeForMap = bestPlace ?? MOCK_BEST_PLACE;

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-2 p-3">
        {isPlaceRecommendEnabled && (
          <LatLngMap
            lat={Number(placeForMap.latitude)}
            lng={Number(placeForMap.longitude)}
            level={4}
            className="h-70 w-full overflow-hidden rounded-2xl"
          />
        )}

        {isTimeRecommendEnabled && (
          <RecommendItem
            icon={Calendar}
            label="추천 시간"
            value="1"
            onClick={() => handleGoToButton('recommend/time')}
          />
        )}

        {isTimeRecommendEnabled && isPlaceRecommendEnabled && (
          <div className="h-px w-full bg-gray-200" />
        )}

        {isPlaceRecommendEnabled && (
          <RecommendItem
            icon={MapPin}
            label="추천 장소"
            value={placeForMap.placeName}
            onClick={() => handleGoToButton('recommend/place')}
          />
        )}
      </div>
    </div>
  );
}
