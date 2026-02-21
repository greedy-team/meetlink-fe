import { type SelectedTime } from '@/types/meetingTypes';
export type Slot =
  | { dayOfWeek: number; startTime: string } // WEEKLY 모드일 때
  | { date: string; startTime: string };

export const convertToSlots = (selectedTimeList: SelectedTime[], dateType: string): Slot[] => {
  return selectedTimeList
    .filter((item) => {
      // 1. dateType에 맞는 데이터만 필터링
      if (dateType === 'WEEKLY') {
        return item.dayOfWeek !== -1; // 주간이면 요일 값이 있는 것만
      }
      return item.date !== ''; // 특정 날짜면 날짜 값이 있는 것만
    })
    .flatMap((item) =>
      item.startTimeList.map((timeInfo) => {
        // 2. dateType에 맞춰 필요한 필드만 포함하여 반환
        if (dateType === 'WEEKLY') {
          return {
            dayOfWeek: item.dayOfWeek,
            startTime: timeInfo.startTime,
          };
        }

        // SPECIFIC_DATE 모드
        return {
          date: item.date,
          startTime: timeInfo.startTime,
        };
      }),
    );
};

export const convertToSelectedTimeList = (slots: Slot[]): SelectedTime[] => {
  const grouped = slots.reduce((acc: Record<string, SelectedTime>, slot) => {
    // 1. 타입 가드: 'date' 속성이 있는지 확인
    const isDateSlot = 'date' in slot;
    const key = isDateSlot ? slot.date : `day-${slot.dayOfWeek}`;

    if (!acc[key]) {
      if (isDateSlot) {
        // 상황 A: 특정 날짜 기반 슬롯
        acc[key] = {
          date: slot.date,
          dayOfWeek: new Date(slot.date).getDay(), // 날짜로부터 요일 계산
          startTimeList: [],
        };
      } else {
        // 상황 B: 주간 반복 기반 슬롯
        acc[key] = {
          date: '',
          dayOfWeek: slot.dayOfWeek,
          startTimeList: [],
        };
      }
    }

    acc[key].startTimeList.push({
      startTime: slot.startTime,
      availableNumber: 0,
    });

    return acc;
  }, {});

  return Object.values(grouped);
};
