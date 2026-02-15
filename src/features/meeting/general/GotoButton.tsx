import React from 'react';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface GoToButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export function GoToButton({
  icon: Icon,
  title,
  description,
  onClick,
  className,
}: GoToButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center justify-between rounded-3xl border-2 p-4 transition-all duration-200',
        'border-gray-200 bg-gray-50 hover:bg-gray-100 active:scale-[0.98]',
        className,
      )}
    >
      <div className="flex flex-col gap-1 text-left">
        <div className="flex items-center gap-2">
          <Icon size={24} className="h-auto! w-auto! text-gray-900 transition-colors" />
          <span className="text-lg leading-tight font-bold text-gray-900">{title}</span>
        </div>
        <span className="text-sm leading-relaxed font-medium text-gray-400">{description}</span>
      </div>

      <div className="rounded-2x transition-color ml-4 flex h-11 w-11 shrink-0 items-center justify-center text-gray-500">
        <ChevronRight strokeWidth={3} className="h-6 w-6" />
      </div>
    </button>
  );
}
