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
  rank: number;
  startTime: string;
}

interface BestPlace {
  address: string;
  avgTravelTime: number;
  latitude: number;
  longitude: number;
  maxTravelTime: number;
  name: string;
  rank: number;
}

//추천 스크립트 제작 함수
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
    const dayPart = hour < 12 ? '오전' : '오후';

    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${dayPart} ${hour}:${minuteStr}`;
  };
  const startFormatted = formatTime(startTime);
  const endFormatted = formatTime(endTime);

  return `${datePart} ${startFormatted} ~ ${endFormatted}`;
};

const makePlaceDescription = (bestPlace: BestPlace | undefined): string => {
  if (!bestPlace) return '장소 정보가 없습니다';

  const { name, address, avgTravelTime, maxTravelTime } = bestPlace;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}분`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
  };

  const avgFormatted = formatDuration(avgTravelTime);
  const maxFormatted = formatDuration(maxTravelTime);
  //짧은 버전
  //const shortAddress = address.split(' ').slice(0, 2).join(' ');

  return `${name} (${address}) | 평균 ${avgFormatted} 소요 (최대 ${maxFormatted})`;
};

interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime: BestTime | undefined;
  bestPlace: BestPlace | undefined;
  className?: string;
  isLoading: boolean;
}

export function RecommendSummaryCard({
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  bestTime,
  bestPlace,
  className,
  isLoading,
}: RecommendSummaryCardProps) {
  const navigate = useNavigate();
  const handleGoToButton = (url: string) => {
    navigate(url);
  };

  const timeValue = makeTimeDescription(bestTime);
  const placeValue = makePlaceDescription(bestPlace);

  if (!isTimeRecommendEnabled && !isPlaceRecommendEnabled) {
    return null; // 혹시나 방지
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[32px] border border-gray-200 bg-gray-50 shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-2 p-3">
        {isPlaceRecommendEnabled && (
          <LatLngMap
            lat={bestPlace?.latitude ?? 37.54972}
            lng={bestPlace?.longitude ?? 127.075475}
            level={4}
            className="h-40 w-full overflow-hidden rounded-t-2xl lg:h-50"
          />
        )}

        {isTimeRecommendEnabled && (
          <RecommendItem
            icon={Clock}
            label="추천 시간"
            value={timeValue}
            onClick={() => handleGoToButton('recommend/time')}
            isLoading={isLoading}
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
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
