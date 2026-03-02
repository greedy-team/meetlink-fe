import { ChevronRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RecommendItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

export function RecommendItem({
  icon: Icon,
  label,
  value,
  onClick,
  className,
  isLoading = false,
}: RecommendItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-start justify-between gap-4 rounded-xl p-1 transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-gray-100 active:scale-[0.98]',
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
      <div className="flex flex-1 flex-col pt-0.5 text-left">
        <span
          className={cn(
            'text-greedy text-sm font-semibold',
            isLoading ? 'w-20 rounded-lg bg-gray-100 text-gray-100' : '',
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'text-lg leading-tight font-bold',
            value ? 'text-gray-900' : 'text-gray-400',
            isLoading ? 'w-60 rounded-md bg-gray-100 text-gray-100' : '',
          )}
        >
          {value}
        </span>
      </div>
      {!isLoading && (
        <div className="rounded-2x transition-color flex h-11 shrink-0 items-center justify-center text-gray-500">
          <ChevronRight strokeWidth={3} className="h-6 w-6" />
        </div>
      )}
    </button>
  );
}
