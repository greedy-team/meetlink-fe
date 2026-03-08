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

  return availabilities?.map((item) => {
    const startTimeList: TimeInfo[] = item.startTimes?.map((time) => ({
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

export interface ParticipantTime {
  availabilities: {
    date?: string;
    dayOfWeek?: number;
    startTimes: string[];
  }[];
  nickname: string;
}

export const convertToCommonTimeList = (
  participantTimeList: ParticipantTime[] | undefined,
): SelectedTime[] => {
  if (!participantTimeList || participantTimeList.length === 0) return [];

  // 날짜 또는 요일별로 그룹화하기 위한 Map
  const scheduleMap = new Map<
    string,
    {
      date: string;
      dayOfWeek: number;
      timeMap: Map<string, TimeInfo>;
    }
  >();

  participantTimeList.forEach((participant) => {
    const { nickname } = participant;

    participant.availabilities?.forEach((availabilities) => {
      const hasDate = !!availabilities.date && availabilities.date !== '';

      // date와 dayOfWeek 값 설정
      const date = hasDate ? availabilities.date! : '';
      const dayOfWeek = hasDate ? -1 : (availabilities.dayOfWeek ?? -1);

      // Map에서 고유하게 식별할 키 생성
      const dayKey = hasDate ? `date:${date}` : `dayOfWeek:${dayOfWeek}`;

      if (!scheduleMap.has(dayKey)) {
        scheduleMap.set(dayKey, {
          date: date,
          dayOfWeek: dayOfWeek,
          timeMap: new Map<string, TimeInfo>(),
        });
      }

      const dayData = scheduleMap.get(dayKey)!;

      // 시간대별로 인원수와 닉네임 집계
      availabilities.startTimes.forEach((startTime) => {
        if (!dayData.timeMap.has(startTime)) {
          dayData.timeMap.set(startTime, {
            startTime,
            availableNumber: 0,
            participants: [],
          });
        }

        const timeInfo = dayData.timeMap.get(startTime)!;
        timeInfo.availableNumber += 1;
        timeInfo.participants!.push(nickname);
      });
    });
  });

  // 정렬 없이 Map에 쌓인 순서 그대로 배열로 변환하여 반환
  return Array.from(scheduleMap.values()).map((dayData) => ({
    date: dayData.date,
    dayOfWeek: dayData.dayOfWeek,
    startTimeList: Array.from(dayData.timeMap.values()),
  }));
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
