import { Check, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RecommendCheckBoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function RecommendCheckBox({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
}: RecommendCheckBoxProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between rounded-3xl border-2 p-4 transition-all duration-200',
        checked ? 'border-greedy bg-greedy/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
      )}
    >
      <div className="flex flex-col gap-2 text-left">
        <div className="flex items-center gap-2">
          <Icon
            size={20}
            className={cn(
              'h-auto! w-auto! transition-colors',
              checked ? 'text-greedy' : 'text-gray-900',
            )}
          />
          <span
            className={cn(
              'text-base font-bold transition-colors',
              checked ? 'text-greedy' : 'text-gray-900',
            )}
          >
            {title}
          </span>
        </div>
        <span className="pr-3 text-xs leading-tight font-medium text-gray-400">{description}</span>
      </div>

      <Check
        strokeWidth={4}
        size={30}
        className={cn(
          'ml-4 h-auto! w-auto! shrink-0 rounded-2xl p-3 transition-colors',
          checked ? 'bg-[#CCE3D3] text-[#4A8B5F]' : 'bg-gray-200 text-transparent',
        )}
      />
    </button>
  );
}
