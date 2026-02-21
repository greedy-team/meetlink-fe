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
  subDays, // 🚨 주 단위 빼기를 위해 추가
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

  // 전체 달력을 감싸는 ref (높이 계산 및 애니메이션 용)
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const weeksInMonth = useMemo<Date[][]>(() => getWeeksInMonth(selectedDate), [selectedDate]);

  // 선택된 날짜가 몇 번째 주(행)에 있는지 계산 (0부터 시작)
  const selectedWeekIndex = useMemo(() => {
    return weeksInMonth.findIndex((week) => week.some((d) => isSameDay(d, selectedDate)));
  }, [weeksInMonth, selectedDate]);

  // 달력 전체 높이를 계산하여 state에 저장 (최초 1회 및 달이 바뀔 때)
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

  // 한 행(week)의 대략적인 높이 (패딩/마진 포함. 필요시 CSS에 맞게 조절)
  const ROW_HEIGHT = 44;

  const today = new Date(); // 오늘 날짜 기준점
  const currentWeekStart = startOfWeek(today);

  // 🚨 수정: 열려있을 때는 월 기준, 닫혀있을 때는 주 기준으로 이전 버튼 비활성화 여부 결정
  const isPrevDisabled = isOpen
    ? !isBefore(startOfMonth(today), startOfMonth(selectedDate))
    : !isBefore(currentWeekStart, startOfWeek(selectedDate));

  // 🚨 수정: 이전 버튼 클릭 시 상태(isOpen)에 따라 월 단위 또는 주 단위 이동
  const handlePrevClick = () => {
    if (isPrevDisabled) return;

    if (isOpen) {
      // 월 단위 이동 (기존 로직)
      const targetMonth = subMonths(selectedDate, 1);
      if (isSameMonth(targetMonth, today)) {
        setSelectedDate(today);
      } else {
        setSelectedDate(startOfMonth(targetMonth));
      }
    } else {
      // 주 단위 이동 (추가된 로직)
      const targetDate = subDays(selectedDate, 7);
      if (isSameDay(startOfWeek(targetDate), currentWeekStart)) {
        setSelectedDate(today); // 이번 주로 돌아왔을 땐 오늘 날짜 선택
      } else {
        setSelectedDate(targetDate);
      }
    }
  };

  // 🚨 수정: 다음 버튼 클릭 시 상태에 따라 월 단위 또는 주 단위 이동
  const handleNextClick = () => {
    if (isOpen) {
      setSelectedDate(startOfMonth(addMonths(selectedDate, 1)));
    } else {
      setSelectedDate(addDays(selectedDate, 7)); // 주 단위 이동
    }
  };

  return (
    <div>
      {/* 달력이 열려있을 때 배경을 덮는 투명 오버레이 */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 h-full w-full cursor-default bg-transparent"
          aria-label="달력 닫기"
        />
      )}

      <div className="w-full overflow-hidden border-b border-gray-200 bg-white font-sans">
        {/* 상단 월 표시 */}
        {dateType === 'SPECIFIC_DATE' && (
          <div className="relative z-45 flex items-center justify-between bg-white px-26 pt-4 pb-2 text-lg font-bold text-gray-800">
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

        {/* 2. 요일 헤더 */}
        <div
          className={cn(
            'relative z-45 grid grid-cols-7 bg-white px-4 pt-2 pl-10 text-center',
            dateType === 'WEEKLY' && 'border-b-0 pb-2',
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

        {dateType === 'SPECIFIC_DATE' && (
          <div className="relative flex flex-col px-4 pl-10">
            <div
              className="relative z-40 transition-all duration-300 ease-in-out"
              style={{
                height: isOpen ? `${contentHeight}px` : `${ROW_HEIGHT}px`,
              }}
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
                        style={{ height: `${ROW_HEIGHT}px` }} // 각 행의 높이 고정
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
        )}

        {/* 토글 버튼 */}
        {dateType === 'SPECIFIC_DATE' && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-45 flex w-full items-center justify-center bg-white text-gray-400 transition-colors hover:bg-gray-50"
          >
            <ChevronDown
              size={24}
              className={cn(
                'transition-transform duration-300',
                isOpen ? 'rotate-180' : 'rotate-0',
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
