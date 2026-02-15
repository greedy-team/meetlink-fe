import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar, type LucideIcon, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type RecommendPlace, type RecommendTime } from '@/types/meetingTypes';

interface RecommendItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  className?: string;
}

export const RecommendItem = ({
  icon: Icon,
  label,
  value,
  placeholder = '추천 값이 없습니다..!',
  onClick,
  className,
}: RecommendItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-4 rounded-xl p-1 transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-gray-100 active:scale-[0.98]',
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dcfce7] text-[#16a34a]">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col pt-0.5">
        <span className="text-sm font-semibold text-[#16a34a]">{label}</span>
        <span
          className={cn(
            'text-lg leading-tight font-bold',
            value ? 'text-gray-900' : 'text-gray-400',
          )}
        >
          {value || placeholder}
        </span>
      </div>
    </div>
  );
};

interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime?: RecommendTime;
  bestPlace?: RecommendPlace;
  className?: string;
}

export const RecommendSummaryCard = ({
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  bestTime,
  bestPlace,
  className,
}: RecommendSummaryCardProps) => {
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
};
