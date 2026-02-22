import { getDate, getDay, getMonth, isValid, parseISO } from 'date-fns';

import { type SelectedTime } from '@/types/meetingTypes';

export interface Candidate {
  availableCount: number;
  date: string;
  dayOfWeek: number;
  endTime: string;
  id: number;
  rank: number;
  startTime: string; // 데이터에 따라 null이 들어올 수도 있음
}

const getDayText = (day: number) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[day] ?? '';
};

// 🚨 에러 원인 해결: 시간 포맷팅 헬퍼 함수에 null 방어 코드 추가
const formatTime = (timeStr?: string | null) => {
  // timeStr이 null, undefined, 또는 빈 문자열("")일 경우 안전하게 빈 문자열 반환
  if (!timeStr) return '';

  const [hour] = timeStr.split(':');
  const h = parseInt(hour, 10);

  // 혹시라도 'HH' 부분이 숫자가 아닐 경우를 대비한 방어 코드
  if (isNaN(h)) return '';

  if (h < 12) return `오전 ${h}시`;
  if (h === 12) return `오후 12시`;
  return `오후 ${h - 12}시`;
};

// date-fns를 활용한 안전한 요일 추출 헬퍼 함수
const getSafeDayOfWeek = (dateStr?: string | null, fallbackDay?: number) => {
  if (dateStr && dateStr.trim() !== '') {
    const parsedDate = parseISO(dateStr);
    if (isValid(parsedDate)) {
      return getDay(parsedDate);
    }
  }
  return Number(fallbackDay);
};

interface TimeRecommendCardProps {
  candidate: Candidate;
  participantsNum: number;
  isTopRank: boolean;
  onClick: (dateString: string) => void;
  timeRange: [number, number];
  commonTimeList: SelectedTime[];
  dateType: string;
}

export function TimeRecommendCard({
  candidate,
  participantsNum,
  isTopRank,
  onClick,
  timeRange,
  commonTimeList,
  dateType,
}: TimeRecommendCardProps) {
  // 혹시 모를 candidate.date null 에러를 방지하기 위한 안전한 파싱
  const parsedCandidateDate = candidate.date ? parseISO(candidate.date) : new Date();
  const isValidDate = isValid(parsedCandidateDate);

  const month = isValidDate ? getMonth(parsedCandidateDate) + 1 : 1;
  const day = isValidDate ? getDate(parsedCandidateDate) : 1;

  // candidate의 정확한 요일 계산
  const candidateDay = getSafeDayOfWeek(candidate.date, candidate.dayOfWeek);

  const titleText =
    dateType === 'SPECIFIC_DATE'
      ? `${month}월 ${day}일 (${getDayText(candidateDay)})`
      : `${getDayText(candidateDay)}요일`;

  // 히트맵을 위한 30분 단위 시간 슬롯 배열 생성
  const timeSlots: string[] = [];
  const [startHour, endHour] = timeRange;
  for (let h = startHour; h < endHour; h++) {
    const hourStr = h.toString().padStart(2, '0');
    timeSlots.push(`${hourStr}:00`);
    timeSlots.push(`${hourStr}:30`);
  }

  // commonTimeList에서 현재 카드와 일치하는 데이터 찾기
  const matchedTimeData = commonTimeList.find((item) => {
    if (dateType === 'SPECIFIC_DATE') {
      return item.date?.trim() === candidate.date?.trim();
    }
    const itemDay = getSafeDayOfWeek(item.date, item.dayOfWeek);
    return itemDay === candidateDay;
  });

  // 찾은 데이터의 startTimeList를 이용해 빠른 조회를 위한 해시맵 생성
  const countMap: Record<string, number> = {};
  if (matchedTimeData && matchedTimeData.startTimeList) {
    matchedTimeData.startTimeList.forEach((info) => {
      if (info.startTime) {
        const timeKey = info.startTime.substring(0, 5);
        countMap[timeKey] = info.availableNumber;
      }
    });
  }

  return (
    <div
      onClick={() => onClick(candidate.date)}
      className={`relative flex cursor-pointer flex-col gap-4 rounded-2xl border p-5 transition-colors ${
        isTopRank ? 'border-green-600 bg-green-50/30' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{titleText}</span>
            {isTopRank && (
              <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                추천
              </span>
            )}
          </div>
          <div className="mt-1 text-sm font-medium text-gray-600">
            {formatTime(candidate.startTime)}{' '}
            {candidate.endTime ? `~ ${formatTime(candidate.endTime)}` : ''}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {candidate.availableCount}/{participantsNum}
        </div>
      </div>

      <div className="flex w-full items-center gap-[2px]">
        {timeSlots.map((slot) => {
          const count = countMap[slot] || 0;
          const ratio = participantsNum > 0 ? count / participantsNum : 0;

          return (
            <div
              key={slot}
              className={`h-2 flex-1 rounded-sm ${count === 0 ? 'bg-gray-100' : 'bg-greedy'}`}
              style={{
                opacity: count === 0 ? 1 : Math.max(0.15, ratio),
              }}
              title={`${slot} - ${count}명 가능`}
            />
          );
        })}
      </div>
    </div>
  );
}
