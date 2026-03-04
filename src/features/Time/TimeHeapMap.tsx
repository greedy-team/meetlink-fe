import React, { useEffect, useMemo, useRef, useState } from 'react';

import { addDays, format, startOfWeek } from 'date-fns';

import { cn } from '@/lib/utils';

import { type SelectedTime } from '@/types/meetingTypes';

// 히트맵 간격을 결정하는 스태틱 변수
const SLOT_HEIGHT = 36;
const HOUR_HEIGHT = SLOT_HEIGHT * 2;

interface TimeHeatMapProps {
  mode: 'INPUT' | 'OUTPUT';
  participantsNum?: number;
  timeRange: [number, number];
  dateType: string;
  selectedDate: Date;
  selectedTimeList: SelectedTime[];
  setSelectedTimeList: React.Dispatch<React.SetStateAction<SelectedTime[]>>;
}

export default function TimeHeatMap({
  mode,
  participantsNum = 1,
  timeRange,
  dateType,
  selectedDate,
  selectedTimeList,
  setSelectedTimeList,
}: TimeHeatMapProps) {
  const [startHour, endHour] = timeRange;

  //시간 범위에 따른 시간 단위 리스트
  const hours = useMemo(
    () => [...Array(endHour - startHour + 1)].map((_, i) => startHour + i),
    [startHour, endHour],
  );

  //시간 범위에 따른 30분 단위 리스트 - 세로 히트맵
  const timeSlots = useMemo(
    () =>
      Array.from({ length: endHour - startHour }, (_, i) => startHour + i).flatMap((hour) => {
        const hourStr = hour.toString().padStart(2, '0');
        return [`${hourStr}:00:00`, `${hourStr}:30:00`];
      }),
    [startHour, endHour],
  );

  //현재 날짜들
  const weekdays = useMemo(() => {
    if (dateType === 'WEEKLY') {
      const start = startOfWeek(new Date()); // format 에러가 나지 않도록 Date 객체로 생성
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    } else {
      const start = startOfWeek(selectedDate);
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }
  }, [selectedDate, dateType]);

  //해당 날짜의 시간의 가능 인원 수
  const getAvailableNumber = (dayOfWeek: number, date: string, startTime: string) => {
    const targetDay = selectedTimeList.find((item) =>
      dateType === 'WEEKLY' ? item.dayOfWeek === dayOfWeek : item.date === date,
    );
    const timeInfo = targetDay?.startTimeList.find((t) => t.startTime === startTime);
    return timeInfo ? timeInfo.availableNumber : 0;
  };

  //시간 토글 함수
  const toggleTime = (dayOfWeek: number, date: string, startTime: string) => {
    if (mode === 'OUTPUT') return; // 출력 모드라면 입력 안돼

    setSelectedTimeList((prev) => {
      const targetTime = prev.find(
        (
          selectedTime, // 클릭 한 시간의 날짜가 있나?
        ) =>
          dateType === 'WEEKLY' ? selectedTime.dayOfWeek === dayOfWeek : selectedTime.date === date,
      );
      if (!targetTime) {
        //없으면 시간 추가해서 반환
        return [
          ...prev,
          {
            date: dateType === 'WEEKLY' ? '' : date,
            dayOfWeek: dateType === 'WEEKLY' ? dayOfWeek : -1,
            startTimeList: [{ startTime, availableNumber: 1 }],
          },
        ];
      }
      // 클릭한 날짜에 해당 시간이 있나?
      const isExisting = targetTime.startTimeList.find(
        (timeInfo) => timeInfo.startTime === startTime,
      );
      const update = prev.map((selectedTime) => {
        const isTarget = // 클릭한 날짜인가?
          dateType === 'WEEKLY' ? selectedTime.dayOfWeek === dayOfWeek : selectedTime.date === date;
        if (isTarget) {
          // 맞음
          return {
            ...selectedTime,
            startTimeList: isExisting
              ? selectedTime.startTimeList.filter((t) => t.startTime !== startTime) // 있으면 제거
              : [...selectedTime.startTimeList, { startTime, availableNumber: 1 }], // 없으면 추가
          };
        } else {
          //아니면 패스
          return selectedTime;
        }
      });
      //제거함으로서 시작 시간이 없으면 제거
      return update.filter((selectedTime) => selectedTime.startTimeList.length > 0);
    });
  };

  return (
    <div className="flex w-full justify-between font-sans select-none">
      {/* 좌측 시간 */}
      <div className="w-6 shrink-0 border-r border-gray-200">
        {hours.map((hour, idx) => (
          <div
            key={hour}
            className="relative text-right text-xs font-medium text-gray-400"
            style={{ height: idx === hours.length - 1 ? 'auto' : HOUR_HEIGHT }}
          >
            <span className="absolute -top-1.75 right-0">{hour}</span>
          </div>
        ))}
      </div>

      {/* 중앙 히트맵 시간 */}
      <div
        className={cn(
          'flex w-full flex-row justify-between bg-white',
          mode === 'INPUT' && 'touch-none',
        )}
      >
        {weekdays.map((value, dayIndex) => {
          const dateStr = format(value, 'yyyy-MM-dd');

          return (
            <div
              key={dayIndex}
              className="flex w-full flex-col border-r border-gray-200 last:border-r-0"
            >
              {timeSlots.map((timeStr, slotIdx) => {
                const availableNum = getAvailableNumber(value.getDay(), dateStr, timeStr);
                const isTopHour = timeStr.endsWith(':00:00');
                const isLastSlot = slotIdx === timeSlots.length - 1;

                const opacityValue = availableNum > 0 ? availableNum / participantsNum : 0;

                return (
                  <button
                    key={slotIdx}
                    onClick={() => toggleTime(value.getDay(), dateStr, timeStr)}
                    style={{
                      height: SLOT_HEIGHT,
                    }}
                    className={cn(
                      'relative transition-colors duration-100',
                      mode === 'INPUT' ? 'cursor-pointer' : '',
                      isTopHour
                        ? 'border-t border-gray-200'
                        : 'border-t border-dashed border-gray-100',
                      isLastSlot ? 'border-b border-gray-200' : '',
                      mode === 'INPUT' && availableNum === 0 ? 'hover:bg-gray-50' : '',
                    )}
                  >
                    {/* 투명도와 배경색만 담당하는 내부 요소 */}
                    {availableNum > 0 && (
                      <div
                        className="bg-greedy pointer-events-none absolute inset-0"
                        style={{
                          // OUTPUT 모드일 때만 비율에 따른 투명도 적용, INPUT일 때는 1(100%)
                          opacity: mode === 'OUTPUT' ? opacityValue : 1,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 우측 여백 */}
      <div className="w-6 shrink-0 border-l border-gray-200"></div>
    </div>
  );
}
