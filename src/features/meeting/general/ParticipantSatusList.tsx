import React, { useState } from 'react';

import { ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type ParticipantList, type ParticipantStatus } from '@/types/meetingTypes';

interface ParticipantStatusListProps {
  list: ParticipantList;
  className?: string;
}

const ParticipantItem = ({
  nickName,
  hasTimeInput,
  hasPlaceInput,
  isLast,
}: ParticipantStatus & { isLast: boolean }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3',
        !isLast && 'border-b-2 border-gray-100',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
          {nickName.charAt(0)}
        </div>
        <span className="text-base font-bold text-gray-800">{nickName}</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            hasTimeInput ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]',
          )}
        >
          <Clock className="h-4 w-4" />
        </div>

        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            hasPlaceInput ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]',
          )}
        >
          <MapPin className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export const ParticipantStatusList = ({ list, className }: ParticipantStatusListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleList = isExpanded ? list : list.slice(0, 3);
  const showExpandButton = list.length > 3;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col">
          {visibleList.map((participant, index) => (
            <ParticipantItem
              key={`${participant.nickName}-${index}`}
              {...participant}
              isLast={index === visibleList.length - 1 && !showExpandButton}
            />
          ))}
        </div>

        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center border-t border-gray-100 bg-gray-50 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100"
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
};
