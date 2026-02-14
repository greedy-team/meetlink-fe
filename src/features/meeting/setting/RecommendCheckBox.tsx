import React from 'react';

import { Check, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RecommendCheckBoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function RecommendCheckBox({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  className,
}: RecommendCheckBoxProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'group flex w-full items-center justify-between rounded-3xl border-2 p-5 transition-all duration-200',
        checked ? 'border-greedy bg-greedy/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
        className,
      )}
    >
      <div className="flex flex-col gap-2 text-left">
        <div className="flex items-center gap-2">
          <Icon
            size={24}
            className={cn(
              'h-auto! w-auto! transition-colors',
              checked ? 'text-greedy' : 'text-gray-900',
            )}
          />
          <span
            className={cn(
              'text-lg leading-tight font-bold transition-colors',
              checked ? 'text-greedy' : 'text-gray-900',
            )}
          >
            {title}
          </span>
        </div>
        <span className="text-sm leading-relaxed font-medium text-gray-400">{description}</span>
      </div>

      <div
        className={cn(
          'ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200',
          checked ? 'bg-[#CCE3D3] text-[#4A8B5F]' : 'bg-gray-200 text-transparent',
        )}
      >
        <Check strokeWidth={4} className="h-6 w-6" />
      </div>
    </button>
  );
}
