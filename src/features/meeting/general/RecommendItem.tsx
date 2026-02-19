import React from 'react';

import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type RecommendPlace, type RecommendTime } from '@/types/meetingTypes';

interface RecommendItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  className?: string;
}

export function RecommendItem({
  icon: Icon,
  label,
  value,
  placeholder = '추천 값이 없습니다..!',
  onClick,
  className,
}: RecommendItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-4 rounded-xl p-1 transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-gray-100 active:scale-[0.98]',
        className,
      )}
    >
      <div className="bg-greedy/10 text-greedy flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col pt-0.5">
        <span className="text-greedy text-sm font-semibold">{label}</span>
        <span
          className={cn(
            'text-lg leading-tight font-bold',
            value ? 'text-gray-900' : 'text-gray-400',
          )}
        >
          {value || placeholder}
        </span>
      </div>
    </div>
  );
}
