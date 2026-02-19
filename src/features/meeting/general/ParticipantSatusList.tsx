import React, { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ParticipantStatusItem } from './ParticipantStatusItem';

import { type ParticipantList } from '@/types/meetingTypes';

interface ParticipantStatusListProps {
  list: ParticipantList;
  className?: string;
}

export function ParticipantStatusList({ list, className }: ParticipantStatusListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleList = isExpanded ? list : list.slice(0, 3);
  const showExpandButton = list.length > 3;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col">
          {visibleList.map((participant, index) => (
            <ParticipantStatusItem
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
}
