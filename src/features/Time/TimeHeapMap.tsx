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

  const getCellData = (dayIndex: number, dateStr: string, timeStr: string) => {
    const targetDay = selectedTimeList.find((item) =>
      dateType === 'WEEKLY' ? item.dayOfWeek === dayIndex : item.date === dateStr,
    );
    const timeInfo = targetDay?.startTimeList.find((t) => t.startTime === timeStr);
    return timeInfo ? timeInfo.availableNumber : 0;
  };

  const toggleTimeBlock = (
    dayIndex: number,
    dateStr: string,
    timeStr: string,
    forceMode?: 'SELECT' | 'DESELECT',
  ) => {
    if (mode === 'OUTPUT') return;

    const availableNum = getCellData(dayIndex, dateStr, timeStr);
    const currentlySelected = availableNum > 0;

    if (forceMode === 'SELECT' && currentlySelected) return;
    if (forceMode === 'DESELECT' && !currentlySelected) return;

    setSelectedTimeList((prev) => {
      const newList = [...prev];
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
        newList.push({
          date: dateType === 'WEEKLY' ? '' : dateStr,
          dayOfWeek: dateType === 'WEEKLY' ? dayIndex : -1,
          startTimeList: [{ startTime: timeStr, availableNumber: 1 }],
        });
      }
      return newList;
    });
  };

  const handlePointerDown = (dayIndex: number, dateStr: string, timeStr: string) => {
    if (mode === 'OUTPUT') return;
    setIsDragging(true);
    const action = getCellData(dayIndex, dateStr, timeStr) > 0 ? 'DESELECT' : 'SELECT';
    setDragAction(action);
    lastToggledCell.current = `${dayIndex}-${timeStr}`;
    toggleTimeBlock(dayIndex, dateStr, timeStr, action);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (mode === 'OUTPUT' || !isDragging || !dragAction || e.pointerType !== 'touch') return;

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

      <div
        className={cn('grid flex-1 grid-cols-7 bg-white', mode === 'INPUT' && 'touch-none')}
        onPointerMove={handlePointerMove}
      >
        {weekDates.map((date, dayIndex) => {
          const dateStr = format(date, 'yyyy-MM-dd');

          return (
            <div key={dayIndex} className="flex flex-col border-r border-gray-200 last:border-r-0">
              {timeSlots.map((timeStr, slotIdx) => {
                const availableNum = getCellData(dayIndex, dateStr, timeStr);
                const isTopHour = timeStr.endsWith(':00:00');

                const opacityValue = availableNum > 0 ? availableNum / participantsNum : 0;

                return (
                  <div
                    key={slotIdx}
                    data-dayindex={dayIndex}
                    data-datestr={dateStr}
                    data-timestr={timeStr}
                    onPointerDown={() => handlePointerDown(dayIndex, dateStr, timeStr)}
                    onPointerEnter={() =>
                      mode === 'INPUT' &&
                      isDragging &&
                      dragAction &&
                      toggleTimeBlock(dayIndex, dateStr, timeStr, dragAction)
                    }
                    style={{
                      height: SLOT_HEIGHT,
                      // 기존: 여기서 전체 셀에 opacity를 줘서 테두리까지 사라지거나 흐려지는 문제가 있었습니다.
                      // 수정: 바깥 래퍼는 높이만 잡아줍니다.
                    }}
                    className={cn(
                      'relative transition-colors duration-100', // 배경 div를 절대 배치하기 위해 relative 추가
                      mode === 'INPUT' && 'cursor-pointer',
                      isTopHour
                        ? 'border-t border-gray-200'
                        : 'border-t border-dashed border-gray-100',
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
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
