import { type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SelectCardButtonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  isDisable?: boolean;
};
export function SelectCardButton({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
  isDisable = false,
}: SelectCardButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={isDisable}
      className={cn(
        'm-2 aspect-square h-auto flex-1 cursor-pointer rounded-[32px] border-2 transition-colors',
        'flex flex-col items-center justify-center gap-3',
        isSelected
          ? 'border-greedy bg-greedy/5 text-greedy hover:bg-greedy/15 hover:text-greedy'
          : 'border-gray-100 bg-white text-gray-200 hover:bg-gray-50 hover:text-gray-400',
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
          isSelected ? 'bg-greedy/10' : 'bg-gray-100',
        )}
      >
        <Icon
          size={24}
          strokeWidth={2.5}
          className={cn(
            'h-auto! w-auto! shrink-0 transition-colors',
            isSelected ? 'text-greedy' : 'text-gray-800',
          )}
        />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-base font-bold text-black">{title}</span>
        <span className="text-xs font-normal text-gray-500">{description}</span>
      </div>
    </Button>
  );
}
