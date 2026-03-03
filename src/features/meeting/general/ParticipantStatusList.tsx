import React, { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ParticipantStatusItem } from './ParticipantStatusItem';

import { type ParticipantList } from '@/types/meetingTypes';

interface ParticipantStatusListProps {
  list: ParticipantList;
  className?: string;
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  isLoading?: boolean;
}

export function ParticipantStatusList({
  list,
  className,
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  isLoading = false,
}: ParticipantStatusListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  //처음에는 최대 3명만 보기
  const visibleList = isExpanded ? list : list.slice(0, 3);
  const showExpandButton = list.length > 3;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white">
        <div className="flex flex-col">
          {visibleList.map((participant, index) => (
            <ParticipantStatusItem
              key={`${participant.nickName}-${index}`}
              {...participant}
              isMe={index === 0}
              hasTimeInput={participant.hasTimeInput}
              hasPlaceInput={participant.hasPlaceInput}
              isLast={index === visibleList.length - 1 && !showExpandButton}
              isTimeRecommendEnabled={isTimeRecommendEnabled}
              isPlaceRecommendEnabled={isPlaceRecommendEnabled}
              isLoading={isLoading}
            />
          ))}
        </div>
        {/* 모든 참여자 리스트 보기 */}
        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'w-full cursor-pointer border-t border-gray-100 bg-gray-50 py-1 transition-colors hover:bg-gray-100',
              'flex items-center justify-center text-sm font-medium text-gray-500',
            )}
          >
            {isExpanded ? (
              <span className="flex items-center gap-1">
                접기 <ChevronUp className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                모든 참여자 보기 <ChevronDown className="h-4 w-4" />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
