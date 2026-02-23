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

export interface Heatmap {
  date?: string;
  dayOfWeek?: number;
  slots: {
    startTime: string;
    availableCount: number;
  }[];
}

export const convertToSelectedTimeList = (
  availabilities: Availability[] | undefined,
): SelectedTime[] => {
  if (!availabilities) return [];

  return availabilities.map((item) => {
    // 1. startTimes 문자열 배열을 TimeInfo 객체 배열로 변환
    const startTimeList: TimeInfo[] = item.startTimes.map((time) => ({
      startTime: time,
      availableNumber: 1, // 1로 고정
    }));

    // 2. 데이터 존재 여부에 따른 조건부 할당
    // item.date가 존재하면 SPECIFIC_DATE 케이스, 아니면 WEEKLY 케이스로 간주
    const isSpecificDate = !!item.date && item.date !== '';

    return {
      date: isSpecificDate ? item.date! : '',
      dayOfWeek: isSpecificDate ? -1 : (item.dayOfWeek ?? -1),
      startTimeList,
    };
  });
};

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
