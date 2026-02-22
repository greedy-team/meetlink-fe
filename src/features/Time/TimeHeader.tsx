import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type SelectedTime } from '@/types/meetingTypes';

// Props 타입 정의
interface TimeHeaderProps {
  dateType: string;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedTimeList: SelectedTime[];
  participantsNum: number;
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
  selectedTimeList = [],
  participantsNum = 0,
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

        {/* 요일 헤더 (WEEKLY일 경우 히트맵 배경 처리 포함) */}
        <div
          className={cn(
            'relative z-45 grid grid-cols-7 px-4 pt-2 pl-10 text-center',
            dateType === 'WEEKLY' && 'border-b-0 pb-2',
            dateType !== 'SPECIFIC_DATE' && 'border-b border-gray-200 pb-2',
          )}
        >
          {DAYS.map((day, idx) => {
            // WEEKLY 모드일 경우 해당 요일의 가장 큰 인원수 찾기
            let maxCount = 0;
            if (dateType === 'WEEKLY' && selectedTimeList.length > 0) {
              const matched = selectedTimeList.find((item) => Number(item.dayOfWeek) === idx);
              if (matched && matched.startTimeList && matched.startTimeList.length > 0) {
                maxCount = Math.max(...matched.startTimeList.map((st) => st.availableNumber));
              }
            }
            const ratio = participantsNum > 0 ? maxCount / participantsNum : 0;

            return (
              <div
                key={day}
                className={cn(
                  'relative flex items-center justify-center font-semibold',
                  getDayColor(idx),
                  dateType === 'WEEKLY' ? 'h-10 text-lg' : 'text-xs', // WEEKLY일 땐 원형 배경을 위해 높이 할당
                )}
              >
                {dateType === 'WEEKLY' && maxCount > 0 && (
                  <div
                    className="bg-greedy absolute h-9 w-9 rounded-lg"
                    style={{ opacity: Math.max(0.15, ratio) }}
                  />
                )}
                {/* 배경이 글자를 덮지 않도록 z-index를 올림 */}
                <span className="relative z-10">{day}</span>
              </div>
            );
          })}
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
                                ? 'rounded-xl bg-gray-400/10'
                                : 'rounded-xl hover:bg-gray-50',
                            )}
                            style={{ height: `${ROW_HEIGHT}px` }}
                          >
                            {week.map((date, dateIdx) => {
                              const isDisabled = isBefore(date, currentWeekStart);

                              // SPECIFIC_DATE 모드일 경우 해당 날짜의 가장 큰 인원수 찾기
                              let maxCount = 0;
                              if (selectedTimeList.length > 0) {
                                const matched = selectedTimeList.find((item) => {
                                  if (!item.date) return false;
                                  try {
                                    return isSameDay(parseISO(item.date), date);
                                  } catch {
                                    return false;
                                  }
                                });
                                if (
                                  matched &&
                                  matched.startTimeList &&
                                  matched.startTimeList.length > 0
                                ) {
                                  maxCount = Math.max(
                                    ...matched.startTimeList.map((st) => st.availableNumber),
                                  );
                                }
                              }
                              const ratio = participantsNum > 0 ? maxCount / participantsNum : 0;

                              return (
                                <div
                                  key={dateIdx}
                                  onClick={() => !isDisabled && handleDateClick(date)}
                                  className={cn(
                                    'relative flex items-center justify-center text-lg font-bold',
                                    getDayColor(date.getDay()),
                                    !isSameMonth(date, selectedDate) && 'opacity-40',
                                    isDisabled && 'cursor-not-allowed opacity-30',
                                  )}
                                >
                                  {/* 투명도를 가진 원형 배경 */}
                                  {maxCount > 0 &&
                                    !isDisabled &&
                                    isSameMonth(date, selectedDate) && (
                                      <div
                                        className="bg-greedy absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-lg"
                                        style={{ opacity: Math.max(0.15, ratio / 2) }}
                                      />
                                    )}
                                  {/* 글자는 투명해지지 않게 위로 띄움 */}
                                  <span className="relative z-10">{date.getDate()}</span>
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

              {/* 토글 버튼 */}
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
