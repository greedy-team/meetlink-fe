import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import { type SelectedTime, type TimeInfo } from '@/types/meetingTypes';
export interface Availability {
  date?: string;
  dayOfWeek?: number;
  startTimes: string[];
}

export const convertToAvailabilities = (
  selectedTimes: SelectedTime[],
  dateType: string,
): Availability[] => {
  return selectedTimes
    .filter((item) => {
      if (dateType === 'WEEKLY') {
        // 주간 반복일 경우: 날짜는 없고 요일 정보가 있는 것만 필터링
        return item.date === '' && item.dayOfWeek !== -1;
      } else {
        // 특정 날짜일 경우: 날짜 정보가 있는 것만 필터링
        return item.date !== '';
      }
    })
    .map((item) => {
      const availability: Availability = {
        startTimes: item.startTimeList.map((info) => info.startTime),
      };

      if (dateType === 'SPECIFIC_DATE') {
        availability.date = item.date;
      } else {
        availability.dayOfWeek = item.dayOfWeek;
      }

      return availability;
    });
};

export const convertToSelectedTimeList = (
  availabilities: Availability[] | undefined,
): SelectedTime[] => {
  if (!availabilities) return [];

  return availabilities.map((item) => {
    const startTimeList: TimeInfo[] = item.startTimes.map((time) => ({
      startTime: time,
      availableNumber: 1, // 1로 고정
    }));

    const isSpecificDate = !!item.date && item.date !== '';

    return {
      date: isSpecificDate ? item.date! : '',
      dayOfWeek: isSpecificDate ? -1 : (item.dayOfWeek ?? -1),
      startTimeList,
    };
  });
};

export interface Heatmap {
  date?: string;
  dayOfWeek?: number;
  slots: {
    startTime: string;
    availableCount: number;
  }[];
}

export const convertToCommonTimeList = (heatmaps: Heatmap[] | undefined): SelectedTime[] => {
  if (!heatmaps) return [];

  return heatmaps.map((item) => {
    const hasDate = !!item.date && item.date !== '';

    return {
      date: hasDate ? item.date! : '',
      dayOfWeek: hasDate ? -1 : (item.dayOfWeek ?? -1),
      startTimeList: item.slots.map((slot) => ({
        startTime: slot.startTime,
        availableNumber: slot.availableCount,
      })),
    };
  });
};

export const getWeeksInMonth = (date: Date): Date[][] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const weekStarts = eachWeekOfInterval({ start: startDate, end: endDate });

  return weekStarts.map((weekStart) =>
    eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart),
    }),
  );
};

// 시간 범위 체크 함수
export const isTimeInRange = (time: string, [startHour, endHour]: [number, number]) => {
  if (!time) return false;
  const [hourStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  //숫자가 맞는지 판별
  if (isNaN(hour)) return false;

  return hour >= startHour && hour < endHour;
};

//참여자 비율 계산 함수
export const getParticipantsRatio = (
  selectedTime: SelectedTime | undefined | null,
  timeRange: [number, number],
  participantsNum: number,
): number => {
  const validTimes =
    selectedTime?.startTimeList?.filter((st) => isTimeInRange(st.startTime, timeRange)) || [];

  const maxCount =
    validTimes.length > 0 ? Math.max(...validTimes.map((st) => st.availableNumber)) : 0;

  return participantsNum > 0 ? maxCount / participantsNum : 0;
};
