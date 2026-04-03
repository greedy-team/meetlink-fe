import React, { useEffect, useMemo, useRef, useState } from 'react';

import { addDays, format, isBefore, isSameDay, parseISO, startOfDay, startOfWeek } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { AvailableParticipantCard } from './AvailableParticipantCard';

import { type SelectedTime, type TimeCandidate } from '@/types/meetingTypes';

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

// 히트맵 간격을 결정하는 스태틱 변수
const SLOT_HEIGHT = 24;
const HOUR_HEIGHT = SLOT_HEIGHT * 2;

interface TimeHeatMapProps {
  mode: 'INPUT' | 'OUTPUT';
  participantsNum?: number;
  maxAvailableNum?: number;
  timeRange: [number, number];
  dateType: string;
  selectedDate: Date;
  selectedTimeList: SelectedTime[];
  setSelectedTimeList?: React.Dispatch<React.SetStateAction<SelectedTime[]>>;
  selectedCandidate?: TimeCandidate | undefined;
}

interface DragState {
  isDragging: boolean;
  start: { x: number; y: number } | null;
  current: { x: number; y: number } | null;
  action: 'ADD' | 'REMOVE' | null;
}

export default function TimeHeatMap({
  mode,
  participantsNum = 1,
  maxAvailableNum = 1,
  timeRange,
  dateType,
  selectedDate,
  selectedTimeList,
  setSelectedTimeList,
  selectedCandidate = undefined,
}: TimeHeatMapProps) {
  const [startHour, endHour] = timeRange;

  // 드래그 상태 관리
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    start: null, //시작 좌표
    current: null, //현재 좌표
    action: null, //모드
  });

  // 이벤트 리스너에서 최신 상태를 참조하기 위한 ref
  const dragStateRef = useRef(dragState);
  const dataRefs = useRef({ weekdays: [] as Date[], timeSlots: [] as string[], dateType });

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
      const start = startOfWeek(new Date());
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    } else {
      const start = startOfWeek(selectedDate);
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }
  }, [selectedDate, dateType]);

  // ref 값들 업데이트
  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);
  useEffect(() => {
    dataRefs.current = { weekdays, timeSlots, dateType };
  }, [weekdays, timeSlots, dateType]);

  const timeDataMap = useMemo(() => {
    const map: Record<
      string | number,
      Record<string, { availableNumber: number; participants: string[] }>
    > = {};

    selectedTimeList.forEach((day) => {
      const key = dateType === 'WEEKLY' ? day.dayOfWeek : day.date;
      map[key] = {};
      day.startTimeList.forEach((time) => {
        map[key][time.startTime] = {
          availableNumber: time.availableNumber,
          participants: time.participants || [],
        };
      });
    });
    return map;
  }, [selectedTimeList, dateType]);

  // 마우스 누를 때 드래그 시작 - 최소 위치 저장
  const handleMouseDown = (dayIndex: number, slotIdx: number, availableNum: number) => {
    if (mode === 'OUTPUT') return; // 출력 모드 라면 입력 안돼
    if (dateType !== 'WEEKLY') {
      // 지난 날짜 라면 안돼
      const selectedDate = weekdays[dayIndex];
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return;
      }
    }

    //초기 선택으로 모드 설정
    const action = availableNum === 0 ? 'ADD' : 'REMOVE';

    setDragState({
      isDragging: true,
      start: { x: dayIndex, y: slotIdx },
      current: { x: dayIndex, y: slotIdx },
      action,
    });
  };

  // 드래그 중인데 입력 모드 일때 - 현재 위치 업데이트
  const handleMouseEnter = (dayIndex: number, slotIdx: number) => {
    if (mode === 'OUTPUT' || !dragState.isDragging) return;

    setDragState((prev) => ({
      ...prev,
      current: { x: dayIndex, y: slotIdx },
    }));
  };

  // 드래그 종료 시 실제 데이터 반영
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      const state = dragStateRef.current;
      if (!state.isDragging) return;

      const { start, current, action } = state;
      if (start && current && action) {
        const {
          weekdays: currentWeekdays,
          timeSlots: currentTimeSlots,
          dateType: currentDateType,
        } = dataRefs.current;

        // 드래그 범위의 인덱스(x, y) 계산
        const minX = Math.min(start.x, current.x);
        const maxX = Math.max(start.x, current.x);
        const minY = Math.min(start.y, current.y);
        const maxY = Math.max(start.y, current.y);

        //범위 안 시작 시간 리스트
        const startTimeListInBound = currentTimeSlots.slice(minY, maxY + 1);

        if (!setSelectedTimeList) {
          setDragState({ isDragging: false, start: null, current: null, action: null });
          return;
        }

        setSelectedTimeList((prev) => {
          //현재 주 문자열 리스트
          const visibleDates = currentWeekdays.map((d) => format(d, 'yyyy-MM-dd'));

          const todayStart = startOfDay(new Date());

          //이미 존재하던 날짜 안에서
          const updatedExisting = prev.map((selectedTime) => {
            const nowX =
              currentDateType === 'WEEKLY'
                ? selectedTime.dayOfWeek
                : visibleDates.indexOf(selectedTime.date);

            // 현재 주에 없는 날짜 이거나 바운드 밖인 경우 유지
            if (nowX === -1 || nowX < minX || maxX < nowX) return selectedTime;

            const isPastDate =
              currentDateType !== 'WEEKLY' &&
              isBefore(startOfDay(currentWeekdays[nowX]), todayStart);
            if (isPastDate) return selectedTime;

            if (action === 'ADD') {
              // 추가 모드일때
              const startTimeListToAdd = startTimeListInBound
                .filter((t) => !selectedTime.startTimeList.some((info) => info.startTime === t))
                .map((t) => ({ startTime: t, availableNumber: 1 }));

              return {
                // 바운드 포함 시작 시간들 추가
                ...selectedTime,
                startTimeList: [...selectedTime.startTimeList, ...startTimeListToAdd],
              };
            } else {
              // 제거 모드일때
              return {
                // 바운드 포함된 시간들 제거
                ...selectedTime,
                startTimeList: selectedTime.startTimeList.filter(
                  (t) => !startTimeListInBound.includes(t.startTime),
                ),
              };
            }
          });

          //selectedTimeList안에 없는 날인 경우 - 추가만
          const newDays =
            action === 'ADD'
              ? Array.from({ length: maxX - minX + 1 }, (_, i) => minX + i) // 범위에 포함되는 좌표 리스트
                  .filter((x) => {
                    const isPastDate =
                      currentDateType !== 'WEEKLY' &&
                      isBefore(startOfDay(currentWeekdays[x]), todayStart);
                    if (isPastDate) return false;

                    // 현재 드래그 범위 내의 x좌표가 기존 prev에 없는지 확인
                    const date = format(currentWeekdays[x], 'yyyy-MM-dd');
                    return !prev.some((selectedTime) =>
                      currentDateType === 'WEEKLY'
                        ? selectedTime.dayOfWeek === x
                        : selectedTime.date === date,
                    );
                  })
                  .map((x) => {
                    return {
                      date:
                        currentDateType === 'WEEKLY'
                          ? ''
                          : format(currentWeekdays[x], 'yyyy-MM-dd'),
                      dayOfWeek: currentDateType === 'WEEKLY' ? x : -1,
                      startTimeList: startTimeListInBound.map((t) => ({
                        startTime: t,
                        availableNumber: 1,
                      })),
                    };
                  })
              : [];
          // 합치기
          return [...updatedExisting, ...newDays].filter((st) => st.startTimeList.length > 0);
        });
      }

      setDragState({ isDragging: false, start: null, current: null, action: null });
    };

    // 통합 이벤트 등록 - PC(마우스)와 모바일(터치) 공통 적용
    window.addEventListener('pointerup', handleGlobalMouseUp);
    window.addEventListener('pointercancel', handleGlobalMouseUp);

    //언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener('pointerup', handleGlobalMouseUp);
      window.removeEventListener('pointercancel', handleGlobalMouseUp);
    };
  }, [setSelectedTimeList]);

  const dragBounds = useMemo(() => {
    if (mode !== 'INPUT' || !dragState.isDragging || !dragState.start || !dragState.current)
      return null;
    return {
      minX: Math.min(dragState.start.x, dragState.current.x),
      maxX: Math.max(dragState.start.x, dragState.current.x),
      minY: Math.min(dragState.start.y, dragState.current.y),
      maxY: Math.max(dragState.start.y, dragState.current.y),
    };
  }, [mode, dragState]);

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
          mode === 'INPUT' && 'touch-none', //스크롤 방지
        )}
      >
        {weekdays.map((date, dayIndex) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isSelectedDate = (() => {
            if (selectedCandidate === undefined || selectedCandidate === null) return false;

            if (dateType === 'WEEKLY') {
              return dayIndex === selectedCandidate.dayOfWeek;
            } else {
              return isSameDay(date, parseISO(String(selectedCandidate.date)));
            }
          })();
          const todayStart = startOfDay(new Date());
          const currentDayStart = startOfDay(date);
          const isPastDate = dateType !== 'WEEKLY' && isBefore(currentDayStart, todayStart);

          return (
            <div
              key={dayIndex}
              className="flex w-full flex-col border-r border-gray-200 last:border-r-0"
            >
              {timeSlots.map((startTime, slotIdx) => {
                const mapKey = dateType === 'WEEKLY' ? dayIndex : dateStr;

                const isInDragBounds = dragBounds // 좌표가 드래그 범위 안에 있는가?
                  ? dayIndex >= dragBounds.minX &&
                    dayIndex <= dragBounds.maxX &&
                    slotIdx >= dragBounds.minY &&
                    slotIdx <= dragBounds.maxY &&
                    !isPastDate
                  : false;

                // 드래그 범위 안 이라면 Drag Action에 따라 미리 색칠
                const participantList = timeDataMap[mapKey]?.[startTime]?.participants || [];

                const availableNum = isInDragBounds
                  ? dragState.action === 'ADD'
                    ? 1
                    : 0
                  : timeDataMap[mapKey]?.[startTime]?.availableNumber || 0;

                const isSelectedTimeSlot = (() => {
                  if (!isSelectedDate || !selectedCandidate) return false;
                  return (
                    startTime >= selectedCandidate.startTime &&
                    startTime < selectedCandidate.endTime
                  );
                })();
                const isStart = isSelectedTimeSlot && startTime === selectedCandidate?.startTime;
                const isEnd = (() => {
                  if (!isSelectedTimeSlot) return false;
                  const nextStartTime = timeSlots[slotIdx + 1];
                  return !nextStartTime || nextStartTime === selectedCandidate?.endTime;
                })();

                const isTopHour = startTime.endsWith(':00:00');
                const isLastSlot = slotIdx === timeSlots.length - 1;

                // INPUT 모드면 무조건 100% OUTPUT 모드면 비율 계산
                const opacityValue = mode === 'INPUT' ? 1 : availableNum / maxAvailableNum;

                const dateLabel =
                  dateType === 'WEEKLY'
                    ? `${dayNames[date.getDay()]}요일`
                    : format(date, 'M월 d일');

                const [h, m] = startTime.split(':');
                const timeLabel = `${h}시${m === '30' ? ' 30분' : ''}`;

                const statusLabel =
                  mode === 'INPUT'
                    ? availableNum > 0
                      ? '선택됨'
                      : '선택 안 됨'
                    : `가능 인원 ${availableNum}명`;

                // 최종 라벨 결합
                const ariaLabel = `${dateLabel} ${timeLabel}, ${statusLabel}`;
                return (
                  <AvailableParticipantCard
                    key={startTime}
                    side="right"
                    mode={mode}
                    isActivate={availableNum !== 0}
                    content={
                      // 출력 모드 - 호버, 클릭 가능 인원 보기
                      <div className="flex flex-col gap-1">
                        <span className="flex text-xs font-bold">
                          가능 인원({availableNum}/{participantsNum})
                        </span>
                        <div className="text-md flex flex-col gap-1">
                          {participantList?.map((nickname) => {
                            return (
                              <Badge
                                key={nickname}
                                variant="secondary"
                                className="bg-greedy/10 text-greedy hover:bg-greedy/10 rounded-full border-none px-2 font-bold"
                              >
                                {nickname}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    }
                  >
                    <button
                      onPointerDown={(e) => {
                        e.preventDefault(); // 기본 드래그 방지
                        e.currentTarget.releasePointerCapture(e.pointerId); // 모바일 터치 드래그 잠금 해제
                        handleMouseDown(dayIndex, slotIdx, availableNum);
                      }}
                      onPointerEnter={() => handleMouseEnter(dayIndex, slotIdx)}
                      style={{
                        height: SLOT_HEIGHT,
                      }}
                      className={cn(
                        'relative transition-colors duration-100',
                        'bg-gray-100/40',
                        mode === 'INPUT' ? 'cursor-pointer' : '',
                        isTopHour
                          ? 'border-t border-gray-200'
                          : 'border-t border-dashed border-gray-100',
                        isLastSlot ? 'border-b border-gray-200' : '',
                        isPastDate ? 'cursor-auto bg-gray-300 opacity-50' : '',
                        mode === 'INPUT' && availableNum === 0 && !isPastDate
                          ? 'hover:bg-gray-50'
                          : '',
                        isSelectedTimeSlot &&
                          isSelectedDate &&
                          'border-l-greedy-strong border-r-greedy-strong border-r-3 border-l-3 border-solid',
                        isSelectedTimeSlot &&
                          isStart &&
                          'border-t-greedy-strong border-t-3 border-solid',
                        isSelectedTimeSlot &&
                          isEnd &&
                          'border-b-greedy-strong border-b-3 border-solid',
                      )}
                      aria-label={ariaLabel}
                      aria-pressed={mode === 'INPUT' ? availableNum > 0 : undefined}
                    >
                      {/* 투명도와 배경색만 담당하는 내부 요소 */}
                      {availableNum > 0 && (
                        <div
                          className={cn(
                            'bg-greedy pointer-events-none absolute inset-0',
                            isSelectedTimeSlot && isSelectedDate && 'animate-relative-pulse',
                          )}
                          style={{
                            // OUTPUT 모드일 때만 비율에 따른 투명도 적용, INPUT일 때는 1(100%)
                            opacity: opacityValue,
                          }}
                        />
                      )}
                    </button>
                  </AvailableParticipantCard>
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
