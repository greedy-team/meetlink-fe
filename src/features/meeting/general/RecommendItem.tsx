import { ChevronRight, type LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RecommendItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder?: string;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
  isCalculating?: boolean;
  haveData?: boolean;
}

export function RecommendItem({
  icon: Icon,
  label,
  value,
  onClick,
  className,
  isLoading = false,
  isCalculating = false,
  haveData = true,
}: RecommendItemProps) {
  return (
    <button
      onClick={() => !isCalculating && !isLoading && haveData && onClick()}
      className={cn(
        'flex items-center justify-between gap-4 rounded-3xl p-2 transition-all duration-200',
        'cursor-pointer hover:bg-gray-100',
        className,
      )}
    >
      <div
        className={cn(
          'bg-greedy/10 text-greedy flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
          isLoading ? 'rounded-3xl bg-gray-100 text-gray-100' : '',
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col pt-0.5 text-left">
        <span
          className={cn(
            'text-greedy text-sm font-semibold',
            isLoading ? 'm-0.5 w-20 rounded-lg bg-gray-100 text-gray-100' : '',
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'flex flex-row flex-wrap items-center gap-x-1.5 overflow-hidden text-lg leading-tight font-bold',
            value ? 'text-gray-900' : 'text-gray-400',
            isLoading ? 'm-0.5 w-60 rounded-lg bg-gray-100 text-gray-100' : '',
          )}
        >
          {value && typeof value === 'string'
            ? value.split(' ').map((part, index) => (
                <span key={index} className="inline-block max-w-full truncate">
                  {part}
                </span>
              ))
            : value}
        </span>
      </div>
      {!isLoading && !isCalculating && haveData && (
        <div className="rounded-2x transition-color flex h-11 shrink-0 items-center justify-center text-gray-500">
          <ChevronRight strokeWidth={3} className="h-6 w-6" />
        </div>
      )}
      {!isLoading && isCalculating && <Loader2 className="h-6 w-11 animate-spin text-gray-500" />}
    </button>
  );
}
