import { getDay } from 'date-fns';
import { Users } from 'lucide-react';

import { type SelectedTime } from '@/types/meetingTypes';

export interface Candidate {
  availableCount: number;
  date: string;
  dayOfWeek: number;
  endTime: string;
  rank: number;
  startTime: string;
}

const getDayText = (day: number) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[day] ?? '';
};

const formatTime = (timeStr: string) => {
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const dayPart = hour < 12 ? '오전' : '오후';

  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${dayPart} ${hour}:${minuteStr}`;
};

const findAvailableNum = (startTime: string, timeData: SelectedTime | undefined) => {
  if (!timeData) return undefined;
  const timeInfo = timeData.startTimeList.find((timeInfo) => timeInfo.startTime === startTime);
  if (!timeInfo) return 0;
  return timeInfo.availableNumber;
};

interface TimeRecommendCardProps {
  candidate: Candidate;
  participantsNum: number;
  maxAvailableNum: number;
  isTopRank: boolean;
  onClick: (dateString: string) => void;
  timeRange: [number, number];
  commonTimeList: SelectedTime[];
  dateType: string;
}

export function TimeRecommendCard({
  candidate,
  participantsNum,
  maxAvailableNum,
  isTopRank,
  onClick,
  timeRange,
  commonTimeList,
  dateType,
}: TimeRecommendCardProps) {
  const month = String(Number(candidate.date?.substring(5, 7)));
  const day = String(Number(candidate.date?.substring(8, 10)));

  const titleText =
    dateType === 'SPECIFIC_DATE'
      ? `${month}월 ${day}일 (${getDayText(getDay(new Date(candidate.date)))})`
      : `${getDayText(candidate.dayOfWeek)}요일`;

  const timeSlots: string[] = [];
  const [startHour, endHour] = timeRange;
  for (let h = startHour; h < endHour; h++) {
    const hourStr = h.toString().padStart(2, '0');
    timeSlots.push(`${hourStr}:00:00`);
    timeSlots.push(`${hourStr}:30:00`);
  }

  const matchedTimeData =
    dateType === 'WEEKLY'
      ? commonTimeList.find((selectedTime) => selectedTime.dayOfWeek === candidate.dayOfWeek)
      : commonTimeList.find((selectedTime) => selectedTime.date === candidate.date);

  return (
    <button
      onClick={() => onClick(candidate.date)}
      className={`relative flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-5 transition-colors ${
        isTopRank ? 'border-greedy bg-greedy/5' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
      aria-label={`${candidate.rank} 순위 추천 카드 - ${dateType === 'WEEKLY' ? getDayText(candidate.dayOfWeek) : candidate.date} - ${candidate.availableCount}명 가능`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{titleText}</span>
            {isTopRank && (
              <span className="bg-greedy rounded-lg px-2 py-0.5 text-xs font-medium text-white">
                추천
              </span>
            )}
          </div>
          <div className="text-md mt-1 font-medium text-gray-600">
            {formatTime(candidate.startTime)}{' '}
            {candidate.endTime ? `~ ${formatTime(candidate.endTime)}` : ''}
          </div>
        </div>
        <div className="text-md flex items-center gap-1.5 font-medium text-gray-500">
          <Users className="h-5 w-5" strokeWidth={2} />
          {candidate.availableCount}/{participantsNum}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex w-full items-center gap-px px-2">
          {timeSlots.map((slot) => {
            const count = findAvailableNum(slot, matchedTimeData) || 0;
            const ratio = maxAvailableNum > 0 ? count / maxAvailableNum : 0;

            return (
              <div
                key={slot}
                className={`h-8 flex-1 ${count === 0 ? 'bg-gray-100' : 'bg-greedy'}`}
                style={{
                  opacity: count === 0 ? 1 : Math.max(0.15, ratio),
                }}
                title={`${slot} - ${count}명 가능`}
              />
            );
          })}
        </div>
        <div className="flex flex-row justify-between text-xs font-medium text-gray-400">
          <span>{`${timeRange[0]}시`}</span>
          <span>{`${timeRange[1]}시`}</span>
        </div>
      </div>
    </button>
  );
}
