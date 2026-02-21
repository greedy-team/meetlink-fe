import React, { useEffect, useMemo, useRef, useState } from 'react';

import { addDays, format, startOfWeek } from 'date-fns';

import { cn } from '@/lib/utils';

import { type SelectedTime, type TimeInfo } from '@/types/meetingTypes';

// 히트맵 간격을 결정하는 스태틱 변수
const SLOT_HEIGHT = 36;
const HOUR_HEIGHT = SLOT_HEIGHT * 2;

interface TimeHeatMapProps {
  timeRange: [number, number];
  dateType: string;
  selectedDate: Date;
  selectedTimeList: SelectedTime[];
  setSelectedTimeList: React.Dispatch<React.SetStateAction<SelectedTime[]>>;
}

export default function TimeHeatMap({
  timeRange,
  dateType,
  selectedDate,
  selectedTimeList,
  setSelectedTimeList,
}: TimeHeatMapProps) {
  const [startHour, endHour] = timeRange;

  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'SELECT' | 'DESELECT' | null>(null);

  const lastToggledCell = useRef<string | null>(null);

  useEffect(() => {
    const handlePointerUpGlobal = () => {
      setIsDragging(false);
      setDragAction(null);
      lastToggledCell.current = null;
    };
    window.addEventListener('pointerup', handlePointerUpGlobal);
    return () => window.removeEventListener('pointerup', handlePointerUpGlobal);
  }, []);

  const hours = useMemo(() => {
    const arr = [];
    for (let i = startHour; i <= endHour; i++) arr.push(i);
    return arr;
  }, [startHour, endHour]);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let i = startHour; i < endHour; i++) {
      const hourStr = i.toString().padStart(2, '0');
      slots.push(`${hourStr}:00:00`);
      slots.push(`${hourStr}:30:00`);
    }
    return slots;
  }, [startHour, endHour]);

  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [selectedDate]);

  // 🚨 수정: dateType에 따라 검색 기준 분리
  const isSelected = (dayIndex: number, dateStr: string, timeStr: string) => {
    const targetDay = selectedTimeList.find((item) =>
      dateType === 'WEEKLY' ? item.dayOfWeek === dayIndex : item.date === dateStr,
    );
    return targetDay?.startTimeList.some((t) => t.startTime === timeStr) ?? false;
  };

  // 🚨 수정: dateType에 따라 데이터 생성 로직 분리
  const toggleTimeBlock = (
    dayIndex: number,
    dateStr: string,
    timeStr: string,
    forceMode?: 'SELECT' | 'DESELECT',
  ) => {
    const currentlySelected = isSelected(dayIndex, dateStr, timeStr);

    if (forceMode === 'SELECT' && currentlySelected) return;
    if (forceMode === 'DESELECT' && !currentlySelected) return;

    setSelectedTimeList((prev) => {
      const newList = [...prev];
      // 검색 기준: WEEKLY는 요일, SPECIFIC_DATE는 날짜
      const targetIndex = newList.findIndex((item) =>
        dateType === 'WEEKLY' ? item.dayOfWeek === dayIndex : item.date === dateStr,
      );

      if (targetIndex >= 0) {
        const target = { ...newList[targetIndex] };
        const timeIndex = target.startTimeList.findIndex((t) => t.startTime === timeStr);

        if (timeIndex >= 0) {
          target.startTimeList = target.startTimeList.filter((_, idx) => idx !== timeIndex);
          if (target.startTimeList.length === 0) newList.splice(targetIndex, 1);
          else newList[targetIndex] = target;
        } else {
          target.startTimeList = [
            ...target.startTimeList,
            { startTime: timeStr, availableNumber: 1 },
          ];
          newList[targetIndex] = target;
        }
      } else if (forceMode !== 'DESELECT') {
        // 🚨 새 데이터 생성 시 dateType에 따라 값 제어
        newList.push({
          date: dateType === 'WEEKLY' ? '' : dateStr, // 주간이면 날짜 없음
          dayOfWeek: dateType === 'WEEKLY' ? dayIndex : -1, // 특정날짜면 요일값 없음(-1)
          startTimeList: [{ startTime: timeStr, availableNumber: 1 }],
        });
      }
      return newList;
    });
  };

  const handlePointerDown = (dayIndex: number, dateStr: string, timeStr: string) => {
    setIsDragging(true);
    const action = isSelected(dayIndex, dateStr, timeStr) ? 'DESELECT' : 'SELECT';
    setDragAction(action);
    lastToggledCell.current = `${dayIndex}-${timeStr}`;
    toggleTimeBlock(dayIndex, dateStr, timeStr, action);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragAction || e.pointerType !== 'touch') return;

    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;

    if (target?.dataset.dayindex && target?.dataset.timestr) {
      const dayIndex = parseInt(target.dataset.dayindex, 10);
      const dateStr = target.dataset.datestr || '';
      const timeStr = target.dataset.timestr;
      const cellId = `${dayIndex}-${timeStr}`;

      if (lastToggledCell.current !== cellId) {
        lastToggledCell.current = cellId;
        toggleTimeBlock(dayIndex, dateStr, timeStr, dragAction);
      }
    }
  };

  return (
    <div className="flex w-full font-sans select-none">
      {/* 1. 좌측 시간 라벨 영역 */}
      <div className="w-6 shrink-0 border-r border-gray-200 pr-2">
        {hours.map((hour, idx) => (
          <div
            key={hour}
            className="relative text-right text-xs font-medium text-gray-400"
            style={{ height: idx === hours.length - 1 ? 'auto' : HOUR_HEIGHT }}
          >
            <span className="absolute -top-[7px] right-0">{hour}</span>
          </div>
        ))}
      </div>

      {/* 2. 우측 히트맵 영역 */}
      <div
        className="grid flex-1 touch-none grid-cols-7 bg-white"
        onPointerMove={handlePointerMove}
      >
        {weekDates.map((date, dayIndex) => {
          const dateStr = format(date, 'yyyy-MM-dd');

          return (
            <div key={dayIndex} className="flex flex-col border-r border-gray-200 last:border-r-0">
              {timeSlots.map((timeStr, slotIdx) => {
                const selected = isSelected(dayIndex, dateStr, timeStr);
                const isTopHour = timeStr.endsWith(':00:00');

                return (
                  <div
                    key={slotIdx}
                    data-dayindex={dayIndex}
                    data-datestr={dateStr}
                    data-timestr={timeStr}
                    onPointerDown={() => handlePointerDown(dayIndex, dateStr, timeStr)}
                    onPointerEnter={() =>
                      isDragging &&
                      dragAction &&
                      toggleTimeBlock(dayIndex, dateStr, timeStr, dragAction)
                    }
                    style={{ height: SLOT_HEIGHT }}
                    className={cn(
                      'cursor-pointer transition-colors duration-100',
                      isTopHour
                        ? 'border-t border-gray-200'
                        : 'border-t border-dashed border-gray-100',
                      selected ? 'bg-greedy' : 'hover:bg-gray-50',
                    )}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
