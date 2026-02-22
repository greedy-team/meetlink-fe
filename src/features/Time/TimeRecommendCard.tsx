export interface Candidate {
  availableCount: number;
  date: string;
  dayOfWeek: number;
  endTime: string;
  id: number;
  rank: number;
  startTime: string;
}

const getDayText = (day: number) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[day] ?? '';
};

const formatTime = (timeStr: string) => {
  const [hour] = timeStr.split(':');
  const h = parseInt(hour, 10);
  if (h < 12) return `오전 ${h}시`;
  if (h === 12) return `오후 12시`;
  return `오후 ${h - 12}시`;
};

// 💡 1. 분리된 TimeRecommendCard 컴포넌트
interface TimeRecommendCardProps {
  candidate: Candidate;
  isTopRank: boolean;
  onClick: (dateString: string) => void;
}

export function TimeRecommendCard({ candidate, isTopRank, onClick }: TimeRecommendCardProps) {
  const dateObj = new Date(candidate.date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return (
    <div
      onClick={() => onClick(candidate.date)}
      className={`relative flex cursor-pointer flex-col gap-4 rounded-2xl border p-5 ${
        isTopRank ? 'border-green-600 bg-green-50/30' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {month}월 {day}일 ({getDayText(candidate.dayOfWeek)})
            </span>
            {isTopRank && (
              <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                추천
              </span>
            )}
          </div>
          <div className="mt-1 text-sm font-medium text-gray-600">
            {formatTime(candidate.startTime)} ~ {formatTime(candidate.endTime)}
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
          {candidate.availableCount}명
        </div>
      </div>
    </div>
  );
}
