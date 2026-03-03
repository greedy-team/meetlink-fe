import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  addDays,
  addMonths,
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

import { getParticipantsRatio, getWeeksInMonth } from './timeFunctions';

import { type SelectedTime } from '@/types/meetingTypes';

// Props 타입 정의
interface TimeHeaderProps {
  dateType: string;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedTimeList: SelectedTime[];
  participantsNum: number;
  timeRange: [number, number];
}

const DAYS: string[] = ['일', '월', '화', '수', '목', '금', '토'];

// date를 포함하는 달력 배열 반환 함수

export default function TimeHeader({
  dateType = 'SPECIFIC_DATE',
  selectedDate,
  setSelectedDate,
  selectedTimeList = [],
  participantsNum = 0,
  timeRange,
}: TimeHeaderProps) {
  //열고 닫고 상태
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //애니메이션 계산용
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // 선택된 날짜에 따른 해당 달력
  const weeksInMonth = useMemo<Date[][]>(() => getWeeksInMonth(selectedDate), [selectedDate]);

  //선택된 날짜와 같은 주 인데스
  const selectedWeekIndex = useMemo(() => {
    return weeksInMonth.findIndex((week) => week.some((d) => isSameDay(d, selectedDate)));
  }, [weeksInMonth, selectedDate]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [weeksInMonth]);

  //특정 날짜 클릭시
  const handleDateClick = (date: Date): void => {
    setSelectedDate(date);
  };

  //요일에 따른 색상
  const getDayColor = (dayIndex: number): string => {
    if (dayIndex === 0) return 'text-red-500';
    if (dayIndex === 6) return 'text-blue-500';
    return 'text-gray-900';
  };

  //행 높이 상수
  const ROW_HEIGHT = 44;

  //오늘, 이번주의 시작일
  const today = new Date();
  const currentWeekStart = startOfWeek(today);

  //이전 주/달 비활성화
  const isPrevDisabled = isOpen
    ? !isBefore(startOfMonth(today), startOfMonth(selectedDate)) // 열린 상태 - 이번달이 선택된 달보다 크거나 같을때
    : !isBefore(currentWeekStart, startOfWeek(selectedDate)); // 닫힌 상태 - 이번주가 선택된 주보다 크거나 같을때

  //이전 주/달 버튼 클릭
  const handlePrevClick = () => {
    if (isPrevDisabled) return;

    if (isOpen) {
      // 열려 있으면

      const targetDate = subMonths(selectedDate, 1);
      if (isSameMonth(targetDate, today)) {
        //목표가 이번달이면
        setSelectedDate(today); //오늘로 설정
      } else {
        setSelectedDate(startOfMonth(targetDate)); // 목표달의 첫 날로
      }
    } else {
      const targetDate = subDays(selectedDate, 7);
      if (isSameDay(startOfWeek(targetDate), currentWeekStart)) {
        // 목표가 이번주이면
        setSelectedDate(today); // 오늘로
      } else {
        setSelectedDate(targetDate); // 목표 주의 첫 날로
      }
    }
  };

  //다음 주/달 클릭
  const handleNextClick = () => {
    if (isOpen) {
      //열려 있으면 다음달의 시작 일로
      setSelectedDate(startOfMonth(addMonths(selectedDate, 1)));
    } else {
      // 닫혀 있으면 다음주로 +7일
      setSelectedDate(addDays(selectedDate, 7));
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full font-sans">
      {isOpen && ( // 백 모달 클릭시 달력 닫기
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-10 h-full w-full cursor-default bg-transparent"
          aria-label="달력 닫기"
        />
      )}

      <div className="relative z-20 w-full">
        {dateType === 'SPECIFIC_DATE' && ( // 특정 날짜 일때
          <div className="flex items-center justify-between bg-white px-26 pt-4 pb-2 text-lg font-bold text-gray-800">
            <button // 이전 주/달 버튼
              onClick={handlePrevClick}
              disabled={isPrevDisabled}
              className={cn(
                'p-1 transition-colors',
                isPrevDisabled
                  ? 'cursor-not-allowed text-gray-300'
                  : 'cursor-pointer text-gray-600 hover:text-gray-900',
              )}
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
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* 요일 헤더 */}
        <div
          className={cn(
            'flex flex-row justify-between bg-white px-10 pt-2 text-center',
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

        {/* 달력 - 특정 날짜 일때 */}
        {dateType === 'SPECIFIC_DATE' && (
          <div className="w-full" style={{ height: `${ROW_HEIGHT + 24}px` }}>
            <div
              className="overflow-hidden bg-white px-10 transition-all duration-300 ease-in-out"
              style={{ height: isOpen ? `${contentHeight}px` : `${ROW_HEIGHT}px` }} //열리면 달력 크기로
            >
              <div
                ref={contentRef}
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
                    <div
                      key={weekIdx}
                      className={cn(
                        'flex flex-row items-center justify-between text-center',
                        'cursor-pointer transition-colors duration-200',
                        isSelectedWeek && isOpen
                          ? 'rounded-xl bg-gray-400/10'
                          : 'rounded-xl hover:bg-gray-50',
                      )}
                      style={{ height: `${ROW_HEIGHT}px` }}
                    >
                      {week.map((date, dateIdx) => {
                        const isDisabled = isBefore(date, addDays(today, -1));

                        // 동일한 날짜 찾기
                        const matched = selectedTimeList.find((item) =>
                          isSameDay(parseISO(item?.date), date),
                        );

                        const ratio = getParticipantsRatio(matched, timeRange, participantsNum);

                        return (
                          <button
                            key={dateIdx}
                            onClick={() => !isDisabled && handleDateClick(date)}
                            className={cn(
                              'flex flex-1 cursor-pointer items-center justify-center text-lg font-bold',
                              (!isSameMonth(date, selectedDate) || isDisabled) && 'opacity-40',
                              isDisabled && 'cursor-not-allowed',
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
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'h-6 w-full rounded-b-xl bg-white text-gray-400 transition-colors hover:bg-gray-50',
                'flex items-center justify-center',
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
        )}
      </div>
    </div>
  );
}
