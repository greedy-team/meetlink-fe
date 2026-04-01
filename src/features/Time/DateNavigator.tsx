import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DateNavigatorProps {
  selectedDate: Date;
  isPrevDisabled: boolean;
  dateType: string;
  handlePrevClick: () => void;
  handleNextClick: () => void;
}

export default function DateNavigator({
  selectedDate,
  isPrevDisabled,
  dateType,
  handlePrevClick,
  handleNextClick,
}: DateNavigatorProps) {
  return (
    <div
      className={cn(
        'flex-eow flex items-center justify-center gap-10 bg-white pt-4 pb-2 text-lg font-bold text-gray-800',

        dateType !== 'WEEKLY' && 'border-r border-l border-gray-100',
      )}
    >
      <button // 이전 주/달 버튼
        onClick={handlePrevClick}
        disabled={isPrevDisabled}
        className={cn(
          'p-1 transition-colors',
          isPrevDisabled
            ? 'pointer-events-none text-gray-300'
            : 'cursor-pointer text-gray-600 hover:text-gray-900',
        )}
        aria-label="이전 주/달으로"
      >
        <ChevronLeft size={24} />
      </button>

      <span>
        {/* 현재 년월 */}
        {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
      </span>

      <button // 다음 주/달 버튼
        onClick={handleNextClick}
        className="cursor-pointer p-1 text-gray-600 transition-colors hover:text-gray-900"
        aria-label="다음 주/달으로"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
