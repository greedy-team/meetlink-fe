import { Clock, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type ParticipantStatus } from '@/types/meetingTypes';

export function ParticipantStatusItem({
  nickName,
  hasTimeInput,
  hasPlaceInput,
  isLast,
}: ParticipantStatus & { isLast: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3',
        !isLast && 'border-b-2 border-gray-100',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
          {nickName.charAt(0)}
        </div>
        <span className="text-base font-bold text-gray-800">{nickName}</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            hasTimeInput ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]',
          )}
        >
          <Clock className="h-4 w-4" />
        </div>

        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            hasPlaceInput ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]',
          )}
        >
          <MapPin className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
