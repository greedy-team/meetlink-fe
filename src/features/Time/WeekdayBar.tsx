import React from 'react';

import { cn } from '@/lib/utils';

import { getParticipantsRatio } from './timeFunctions';

import { type SelectedTime } from '@/types/meetingTypes';

interface WeekdayBarProps {
  dateType: string;
  selectedTimeList: SelectedTime[];
  participantsNum: number;
  timeRange: [number, number];
}

const DAYS: string[] = ['일', '월', '화', '수', '목', '금', '토'];

export default function WeekdayBar({
  dateType,
  selectedTimeList,
  participantsNum,
  timeRange,
}: WeekdayBarProps) {
  // 요일에 따른 색상
  const getDayColor = (dayIndex: number): string => {
    if (dayIndex === 0) return 'text-red-500';
    if (dayIndex === 6) return 'text-blue-500';
    return 'text-gray-900';
  };

  return (
    <div
      className={cn(
        'flex flex-row justify-between bg-white px-10 pt-2 text-center',

        dateType !== 'WEEKLY' && 'border-r border-l border-gray-100',
        dateType === 'WEEKLY' ? 'border-b border-gray-200 pb-2' : '', // 주간 이면 하단 보더 생성
      )}
    >
      {DAYS.map((day, idx) => {
        //일 ~ 토 순회
        const matched =
          dateType === 'WEEKLY' && selectedTimeList.length > 0 // 주간이고 선택된 시간들이 있을때
            ? selectedTimeList.find((item) => Number(item.dayOfWeek) === idx) // 현재 요일과 같은 시간들
            : null;

        const ratio = getParticipantsRatio(matched, timeRange, participantsNum);

        return (
          <span
            key={day}
            className={cn(
              'mx-auto flex h-10 w-10 items-center justify-center text-center font-bold',
              dateType === 'WEEKLY' ? '' : getDayColor(idx),

              // 조건부 크기 및 스타일
              dateType === 'WEEKLY' ? 'text-lg' : 'text-sm',
              dateType === 'WEEKLY' && ratio > 0
                ? 'bg-greedy w-10 rounded-lg border text-white'
                : '',
            )}
            style={dateType === 'WEEKLY' && ratio > 0 ? { opacity: ratio } : {}}
          >
            {day}
          </span>
        );
      })}
    </div>
  );
}
