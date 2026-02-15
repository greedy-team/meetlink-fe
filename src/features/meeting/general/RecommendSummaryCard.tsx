import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar, type LucideIcon, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { RecommendItem } from './RecommendItem';

import { type RecommendPlace, type RecommendTime } from '@/types/meetingTypes';
interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime?: RecommendTime;
  bestPlace?: RecommendPlace;
  className?: string;
}

export function RecommendSummaryCard({
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  bestTime,
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

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-2 p-3">
        {isPlaceRecommendEnabled && <div>지도 api</div>}

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
            value="세종대학교ㅌ"
            onClick={() => handleGoToButton('recommend/place')}
          />
        )}
      </div>
    </div>
  );
}
