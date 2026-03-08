import { useMemo } from 'react';

import { addDays, isBefore, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { getParticipantsRatio, getWeeksInMonth } from './timeFunctions';

import { type SelectedTime } from '@/types/meetingTypes';

interface CalendarProps {
  isOpen: boolean;
  setIsOpen: (bool: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeList: SelectedTime[];
  participantsNum: number;
  timeRange: [number, number];
}

const ROW_HEIGHT = 44; // 행 높이 상수

export default function Calendar({
  isOpen,
  setIsOpen,
  selectedDate,
  setSelectedDate,
  selectedTimeList,
  participantsNum,
  timeRange,
}: CalendarProps) {
  // 열고 닫고 상태

  // 오늘 날짜
  const today = useMemo(() => new Date(), []);

  // 선택된 날짜에 따른 해당 달력
  const weeksInMonth = useMemo<Date[][]>(() => getWeeksInMonth(selectedDate), [selectedDate]);

  // 선택된 날짜와 같은 주 인덱스
  const selectedWeekIndex = useMemo(() => {
    return weeksInMonth.findIndex((week) => week.some((d) => isSameDay(d, selectedDate)));
  }, [weeksInMonth, selectedDate]);

  // 전체 달력 높이
  const contentHeight = weeksInMonth.length * ROW_HEIGHT;

  return (
    <div className="relative z-20 w-full">
      <div className="w-full" style={{ height: `${ROW_HEIGHT + 24}px` }}>
        <div
          className="overflow-hidden bg-white px-10 transition-all duration-300 ease-in-out"
          style={{ height: isOpen ? `${contentHeight}px` : `${ROW_HEIGHT}px` }} //열리면 달력 크기로
        >
          <div
            className="flex w-full flex-col transition-transform duration-300 ease-in-out"
            style={{
              transform: isOpen
                ? 'translateY(0)' // 열렸을 때 기본 상태
                : `translateY(-${selectedWeekIndex * ROW_HEIGHT}px)`, // 닫히면 선택된 주의 높만큼 위로 이동
            }}
          >
            {weeksInMonth.map((week, weekIdx) => {
              // 달력 렌더링
              const isSelectedWeek = weekIdx === selectedWeekIndex; // 선택된 주이면

              return (
                <div // 주단위 그룹
                  key={weekIdx}
                  className={cn(
                    'flex flex-row items-center justify-between text-center',
                    'transition-colors duration-200',
                    isSelectedWeek && isOpen
                      ? 'rounded-xl bg-gray-400/10'
                      : 'rounded-xl hover:bg-gray-50',
                  )}
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {week.map((date, dateIdx) => {
                    // 일 별로
                    const isDisabled = isBefore(date, addDays(today, -1));

                    // 동일한 날짜 찾기
                    const matched = selectedTimeList.find((item) =>
                      item.date ? isSameDay(parseISO(item.date), date) : false,
                    );

                    const ratio = getParticipantsRatio(matched, timeRange, participantsNum);

                    return (
                      <button
                        key={dateIdx}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDate(date);
                            setIsOpen(false);
                          }
                        }}
                        className={cn(
                          'flex flex-1 items-center justify-center text-lg font-bold',
                          (!isSameMonth(date, selectedDate) || isDisabled) && 'opacity-10',
                          isDisabled ? 'pointer-events-none' : 'cursor-pointer',
                        )}
                      >
                        <span
                          className={cn(
                            'relative flex h-10 w-10 items-center justify-center text-center',
                            ratio > 0 && !isDisabled ? 'bg-greedy rounded-lg text-white' : '',
                          )}
                          style={ratio > 0 && !isDisabled ? { opacity: ratio } : {}}
                        >
                          {date.getDate()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* 토글 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            '-mt-px h-6 w-full rounded-b-xl bg-white text-gray-400 transition-colors hover:bg-gray-50',
            'flex cursor-pointer items-center justify-center',
          )}
        >
          <ChevronDown
            size={24}
            className={cn('transition-transform duration-300', isOpen ? 'rotate-180' : 'rotate-0')}
          />
        </button>
      </div>
    </div>
  );
}
