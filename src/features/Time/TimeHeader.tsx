import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

// Props 타입 정의
interface TimeHeaderProps {
  dateType?: string;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DAYS: string[] = ['일', '월', '화', '수', '목', '금', '토'];

// 헬퍼 함수: 특정 달의 모든 주(Week) 배열 생성
const getWeeksInMonth = (date: Date): Date[][] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    currentWeek.push(currentDate);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate = addDays(currentDate, 1);
  }

  return weeks;
};

export default function TimeHeader({
  dateType = 'SPECIFIC_DATE',
  selectedDate,
  setSelectedDate,
}: TimeHeaderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const weeksInMonth = useMemo<Date[][]>(() => getWeeksInMonth(selectedDate), [selectedDate]);

  const selectedWeekIndex = useMemo(() => {
    return weeksInMonth.findIndex((week) => week.some((d) => isSameDay(d, selectedDate)));
  }, [weeksInMonth, selectedDate]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [weeksInMonth]);

  const handleDateClick = (date: Date): void => {
    setSelectedDate(date);
    // setIsOpen(false);
  };

  const getDayColor = (dayIndex: number): string => {
    if (dayIndex === 0) return 'text-red-500';
    if (dayIndex === 6) return 'text-blue-500';
    return 'text-gray-900';
  };

  const ROW_HEIGHT = 44;

  const today = new Date();
  const currentWeekStart = startOfWeek(today);

  const isPrevDisabled = isOpen
    ? !isBefore(startOfMonth(today), startOfMonth(selectedDate))
    : !isBefore(currentWeekStart, startOfWeek(selectedDate));

  const handlePrevClick = () => {
    if (isPrevDisabled) return;

    if (isOpen) {
      const targetMonth = subMonths(selectedDate, 1);
      if (isSameMonth(targetMonth, today)) {
        setSelectedDate(today);
      } else {
        setSelectedDate(startOfMonth(targetMonth));
      }
    } else {
      const targetDate = subDays(selectedDate, 7);
      if (isSameDay(startOfWeek(targetDate), currentWeekStart)) {
        setSelectedDate(today);
      } else {
        setSelectedDate(targetDate);
      }
    }
  };

  const handleNextClick = () => {
    if (isOpen) {
      setSelectedDate(startOfMonth(addMonths(selectedDate, 1)));
    } else {
      setSelectedDate(addDays(selectedDate, 7));
    }
  };

  return (
    <div className="relative z-50 w-full font-sans">
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 h-full w-full cursor-default bg-transparent"
          aria-label="달력 닫기"
        />
      )}

      <div className="w-full bg-white">
        {dateType === 'SPECIFIC_DATE' && (
          <div className="relative z-45 flex items-center justify-between px-26 pt-4 pb-2 text-lg font-bold text-gray-800">
            {/* 이전 버튼 */}
            <button
              onClick={handlePrevClick}
              disabled={isPrevDisabled}
              className={cn(
                'p-1 transition-colors',
                isPrevDisabled
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              <ChevronLeft size={24} />
            </button>

            <span>
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
            </span>

            {/* 다음 버튼 */}
            <button
              onClick={handleNextClick}
              className="p-1 text-gray-600 transition-colors hover:text-gray-900"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* 요일 헤더 */}
        <div
          className={cn(
            'relative z-45 grid grid-cols-7 px-4 pt-2 pl-10 text-center',
            dateType === 'WEEKLY' && 'border-b-0 pb-2',
            dateType !== 'SPECIFIC_DATE' && 'border-b border-gray-200 pb-2',
          )}
        >
          {DAYS.map((day, idx) => (
            <div
              key={day}
              className={cn(
                'font-semibold',
                getDayColor(idx),
                dateType === 'WEEKLY' ? 'text-lg' : 'text-xs',
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 본문 + 토글 영역 (SPECIFIC_DATE 일 때만 렌더링) */}
        {dateType === 'SPECIFIC_DATE' && (
          <div className="relative w-full" style={{ height: `${ROW_HEIGHT + 24}px` }}>
            <div className="absolute top-0 left-0 z-40 w-full border-b border-gray-200 bg-white">
              <div className="relative flex flex-col overflow-hidden px-4 pl-10">
                <div
                  className="relative z-40 transition-all duration-300 ease-in-out"
                  style={{ height: isOpen ? `${contentHeight}px` : `${ROW_HEIGHT}px` }}
                >
                  <div
                    ref={contentRef}
                    className="absolute w-full transition-transform duration-300 ease-in-out"
                    style={{
                      transform: isOpen
                        ? 'translateY(0)'
                        : `translateY(-${selectedWeekIndex * ROW_HEIGHT}px)`,
                    }}
                  >
                    <div className="flex flex-col">
                      {weeksInMonth.map((week, weekIdx) => {
                        const isSelectedWeek = weekIdx === selectedWeekIndex;

                        return (
                          <div
                            key={weekIdx}
                            className={cn(
                              'grid cursor-pointer grid-cols-7 py-2 text-center transition-colors duration-200',
                              isSelectedWeek && !isOpen && 'bg-transparent',
                              isSelectedWeek && isOpen
                                ? 'bg-greedy/10 rounded-xl'
                                : 'rounded-xl hover:bg-gray-50',
                            )}
                            style={{ height: `${ROW_HEIGHT}px` }}
                          >
                            {week.map((date, dateIdx) => {
                              const isDisabled = isBefore(date, currentWeekStart);

                              return (
                                <div
                                  key={dateIdx}
                                  onClick={() => !isDisabled && handleDateClick(date)}
                                  className={cn(
                                    'flex items-center justify-center text-lg font-bold',
                                    getDayColor(date.getDay()),
                                    !isSameMonth(date, selectedDate) && 'opacity-40',
                                    isDisabled && 'cursor-not-allowed opacity-30',
                                  )}
                                >
                                  {date.getDate()}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 토글 버튼 (Spacer 높이 계산을 위해 h-[24px] 명시 추가) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  'relative z-45 flex h-[24px] w-full items-center justify-center bg-white text-gray-400 transition-colors hover:bg-gray-50',
                )}
              >
                <ChevronDown
                  size={24}
                  className={cn(
                    'transition-transform duration-300',
                    isOpen ? 'rotate-180' : 'rotate-0',
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
