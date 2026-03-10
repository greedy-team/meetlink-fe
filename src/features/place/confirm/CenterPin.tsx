import { MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CenterPinProps {
  type?: 'start' | 'end'; // 핀 종류 (기본값: 도착지)
  isFixed?: boolean; // 화면 정중앙 고정 여부 (기본값: true)
}

export function CenterPin({ type = 'start', isFixed = true }: CenterPinProps) {
  const isStart = type === 'end';

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        isFixed
          ? 'pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full'
          : 'relative z-10 cursor-pointer',
      )}
    >
      <div className="relative flex items-center justify-center">
        <MapPin
          className={cn(
            'h-10 w-10 drop-shadow-md',
            isStart ? 'fill-red-500 text-red-500' : 'fill-greedy text-greedy',
          )}
          strokeWidth={1} // 외곽선을 얇게 줘서 플랫한 느낌 추가
        />
        {/* 핀 안쪽 구멍 */}
        <div className="absolute top-2.5 h-3 w-3 rounded-full bg-white shadow-sm" />
      </div>
    </div>
  );
}
