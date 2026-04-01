import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Clock, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { LatLngMap } from './LatLngMap';
import { RecommendItem } from './RecommendItem';

import { CenterPin } from '@/features/place/confirm/CenterPin';
import type { GetRecommendResultResponse } from '@/types/apiTypes';

type BestTime = GetRecommendResultResponse['result']['timeCandidate'];
type BestPlace = GetRecommendResultResponse['result']['placeCandidate'];

//추천 스크립트 제작 함수
const makeTimeDescription = (bestTime: BestTime | undefined): string => {
  if (!bestTime?.startTime || !bestTime?.endTime) return '시간 정보가 없어요';

  const { date, dayOfWeek, startTime, endTime } = bestTime;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  if ((!date || date === '') && dayOfWeek === undefined) {
    return '시간 정보가 없어요';
  }

  const datePart =
    date && date !== ''
      ? `${date}\u00A0(${dayNames[new Date(date).getDay()]})` // 날짜가 있을 때
      : `${dayNames[dayOfWeek as number]}요일`; // 요일

  const formatTime = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    const rawHour = parseInt(hourStr, 10);
    const dayPart = rawHour < 12 ? '오전' : '오후';

    const hour = rawHour > 12 ? rawHour - 12 : rawHour === 0 ? 12 : rawHour;

    return `${dayPart}\u00A0${hour}:${minuteStr}`;
  };

  const startFormatted = formatTime(startTime);
  const endFormatted = formatTime(endTime);

  // 날짜(datePart) 뒤의 일반 공백(' ')에서만 줄바꿈이 일어납니다.
  return `${datePart} ${startFormatted}\u00A0~\u00A0${endFormatted}`;
};
const makePlaceDescription = (bestPlace: BestPlace | undefined): string => {
  if (!bestPlace?.name) return '장소 정보가 없어요';

  const name = bestPlace.name.replaceAll(' ', '\u00A0');
  const address = bestPlace.address?.replaceAll(' ', '\u00A0');

  return `${name} (${address})`;
};

interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime: BestTime | undefined;
  bestPlace: BestPlace | undefined;
  className?: string;
  isLoading: boolean;
  isTimeCalculating?: boolean;
  isPlaceCalculating?: boolean;
}

export function RecommendSummaryCard({
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  bestTime,
  bestPlace,
  className,
  isLoading,
  isTimeCalculating = false,
  isPlaceCalculating = false,
}: RecommendSummaryCardProps) {
  const navigate = useNavigate();
  const handleGoToButton = (url: string) => {
    navigate(url);
  };

  const timeValue = !isTimeCalculating
    ? makeTimeDescription(bestTime)
    : '추천 시간을 계산 중이에요!';
  const placeValue = !isPlaceCalculating
    ? makePlaceDescription(bestPlace)
    : '추천 장소를 계산 중이에요!';

  if (!isTimeRecommendEnabled && !isPlaceRecommendEnabled) {
    return null; // 혹시나 방지
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[32px] border-2 border-gray-200 bg-gray-50',
        'flex flex-col p-1',
        className,
      )}
    >
      {isPlaceRecommendEnabled && (isLoading || (!isPlaceCalculating && bestPlace?.latitude)) && (
        <div className="p-2 pb-1">
          {!isLoading && bestPlace?.latitude ? (
            <div className="relative h-40 w-full overflow-hidden rounded-2xl lg:h-50">
              <LatLngMap
                lat={bestPlace!.latitude!}
                lng={bestPlace!.longitude!}
                level={4}
                className="h-full w-full"
                isInteractive={false}
              />
              <div className="pointer-events-none absolute inset-0 z-10">
                <CenterPin />
              </div>
            </div>
          ) : (
            <div className="h-40 rounded-2xl bg-gray-100 lg:h-50" />
          )}
        </div>
      )}

      {isTimeRecommendEnabled && (
        <RecommendItem
          icon={Clock}
          label="추천 시간"
          value={timeValue}
          onClick={() => handleGoToButton('recommendations/time')}
          isLoading={isLoading}
          isCalculating={isTimeCalculating}
          haveData={bestTime?.rank ? true : false}
        />
      )}

      {isTimeRecommendEnabled && isPlaceRecommendEnabled && (
        <div className="px-2 py-1">
          <div className="h-px w-full bg-gray-200" />
        </div>
      )}

      {isPlaceRecommendEnabled && (
        <RecommendItem
          icon={MapPin}
          label="추천 장소"
          value={placeValue}
          onClick={() => handleGoToButton('recommendations/place')}
          isLoading={isLoading}
          isCalculating={isPlaceCalculating}
          haveData={bestPlace?.rank ? true : false}
        />
      )}
    </div>
  );
}
