import { Clock, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type ParticipantStatus } from '@/types/meetingTypes';

interface ParticipantStatusItemProps extends ParticipantStatus {
  isLast: boolean;
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
}

export function ParticipantStatusItem({
  nickName,
  hasTimeInput,
  hasPlaceInput,
  isLast,
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
}: ParticipantStatusItemProps & { isLast: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3',
        !isLast && 'border-b-2 border-gray-100',
      )}
    >
      {/* 왼쪽: 프로필 및 닉네임 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
          {nickName.charAt(0)}
        </div>
        <span className="text-base font-bold text-gray-800">{nickName}</span>
      </div>

      {/* 오른쪽: 상태 아이콘 (조건부 렌더링) */}
      <div className="flex items-center gap-2">
        {/* 시간 추천이 활성화된 경우만 렌더링 */}
        {isTimeRecommendEnabled && (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              hasTimeInput ? 'bg-greedy/10 text-greedy' : 'bg-red-100 text-red-500',
            )}
          >
            <Clock className="h-4 w-4" />
          </div>
        )}

        {/* 장소 추천이 활성화된 경우만 렌더링 */}
        {isPlaceRecommendEnabled && (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              hasPlaceInput ? 'bg-greedy/10 text-greedy' : 'bg-red-100 text-red-500',
            )}
          >
            <MapPin className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
