import { type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SelectCardButtonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};
export function SelectCardButton({
  icon: Icon,
  title,
  description,
  isActive,
  onClick,
}: SelectCardButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        'm-2 flex aspect-square h-auto flex-1 flex-col items-center justify-center gap-3 rounded-[32px] border-2 transition-colors',
        isActive
          ? 'border-greedy bg-greedy/5 text-greedy hover:bg-greedy/10 hover:text-greedy'
          : 'border-gray-100 bg-white text-gray-200 hover:bg-gray-100',
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
          isActive ? 'bg-greedy/10' : 'bg-gray-100',
        )}
      >
        <Icon
          size={24}
          strokeWidth={2.5}
          className={cn(
            'h-auto! w-auto! shrink-0 transition-colors',
            isActive ? 'text-greedy' : 'text-gray-800',
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
