import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Clock, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { LatLngMap } from './LatLngMap';
import { RecommendItem } from './RecommendItem';

interface BestTime {
  availableCount: number;
  date: string;
  dayOfWeek: number;
  endTime: string;
  id: number;
  rank: number;
  startTime: string;
}

interface BestPlace {
  address: string;
  avgTravelTime: number;
  id: number;
  latitude: number;
  longitude: number;
  maxTravelTime: number;
  name: string;
  rank: number;
}

const makeTimeDescription = (bestTime: BestTime | undefined): string => {
  if (!bestTime) return '시간 정보가 없습니다';
  const { date, dayOfWeek, startTime, endTime } = bestTime;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  let datePart = '';
  if (date && date !== '') {
    const dateObj = new Date(date);
    const dayName = dayNames[dateObj.getDay()];
    datePart = `${date} (${dayName})`;
  } else if (dayOfWeek !== -1) {
    datePart = `${dayNames[dayOfWeek]}요일`;
  }

  const formatTime = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour < 12 ? '오전' : '오후';

    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return `${ampm} ${hour}:${minuteStr}`;
  };

  const startFormatted = formatTime(startTime);
  const endFormatted = formatTime(endTime);

  return `${datePart} ${startFormatted} ~ ${endFormatted}`;
};

interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime: BestTime | undefined;
  bestPlace: BestPlace | undefined;
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

  const timeValue = makeTimeDescription(bestTime);
  const placeValue = bestPlace?.address || '장소 정보가 없습니다';

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
        {isPlaceRecommendEnabled && (
          <LatLngMap
            lat={bestPlace?.latitude ?? 37.5665}
            lng={bestPlace?.longitude ?? 126.978}
            level={4}
            className="h-70 w-full overflow-hidden rounded-2xl"
          />
        )}

        {isTimeRecommendEnabled && (
          <RecommendItem
            icon={Clock}
            label="추천 시간"
            value={timeValue}
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
            value={placeValue}
            onClick={() => handleGoToButton('recommend/place')}
          />
        )}
      </div>
    </div>
  );
}
