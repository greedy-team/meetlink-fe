import React from 'react';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface GoToButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
  isDone?: boolean;
  isLoading?: boolean;
}

export function GoToButton({
  icon: Icon,
  title,
  description,
  onClick,
  className,
  isDone = false,
  isLoading = false,
}: GoToButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 p-4 transition-all duration-200',
        'border-gray-200 bg-gray-50 hover:bg-gray-100',
        isDone ? 'bg-greedy/15 hover:bg-greedy/30' : '',
        className,
      )}
    >
      <div className="flex flex-col gap-1 text-left">
        <div className={cn('flex items-center gap-2')}>
          <Icon
            size={24}
            className={cn(
              'h-auto! w-auto! text-gray-900 transition-colors',
              isDone ? 'text-greedy' : '',
              isLoading ? 'rounded-full bg-gray-100 text-gray-100' : '',
            )}
          />
          <span
            className={cn(
              'text-base leading-tight font-bold text-gray-900',
              isDone ? 'text-greedy' : '',
              isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : '',
            )}
          >
            {title}
          </span>
        </div>
        <span
          className={cn(
            'text-xs leading-relaxed font-medium text-gray-400',
            isDone ? 'text-greedy' : '',
            isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : '',
          )}
        >
          {description}
        </span>
      </div>
      {!isLoading && (
        <div className="rounded-2x transition-color ml-4 flex h-11 shrink-0 items-center justify-center text-gray-500">
          <ChevronRight strokeWidth={3} className="h-6 w-6" />
        </div>
      )}
    </button>
  );
}
