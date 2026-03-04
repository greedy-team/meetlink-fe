import React, { useState } from 'react';

import {
  addDays,
  addMonths,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';

import Calendar from './Calendar';
import DateNavigator from './DateNavigator';
import WeekdayBar from './WeekDayBar';

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
        {/* 달력 헤더 - 특정 날짜 일때 */}
        {dateType === 'SPECIFIC_DATE' && (
          <DateNavigator
            handleNextClick={handleNextClick}
            handlePrevClick={handlePrevClick}
            isPrevDisabled={isPrevDisabled}
            selectedDate={selectedDate}
          />
        )}

        {/* 요일 헤더 - 항상 렌더링*/}
        <WeekdayBar
          dateType={dateType}
          participantsNum={participantsNum}
          selectedTimeList={selectedTimeList}
          timeRange={timeRange}
        />

        {/* 달력 - 특정 날짜 일때 */}
        {dateType === 'SPECIFIC_DATE' && (
          <Calendar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeList={selectedTimeList}
            participantsNum={participantsNum}
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  );
}
