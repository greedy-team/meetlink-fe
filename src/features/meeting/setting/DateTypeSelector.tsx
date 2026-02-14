import { Calendar, type LucideIcon, Repeat } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SelectCardButtonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
};
export function SelectCardButton({
  icon: Icon,
  title,
  description,
  isActive,
  onClick,
  className,
}: SelectCardButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        'flex aspect-square h-auto flex-1 flex-col items-center justify-center gap-3 rounded-[32px] border-2 p-0 transition-all',
        isActive
          ? 'border-greedy bg-greedy/5 text-greedy hover:bg-greedy/10 hover:text-greedy'
          : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors',
          isActive ? 'bg-greedy/10' : 'bg-gray-100',
        )}
      >
        <Icon
          size={24}
          strokeWidth={2.5}
          className={cn(
            'h-auto! w-auto! shrink-0 transition-colors',
            isActive ? 'text-greedy' : 'text-gray-600',
          )}
        />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-black">{title}</span>
        <span className="text-mg font-normal text-gray-500">{description}</span>
      </div>
    </Button>
  );
}

type DateTypeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function DateTypeSelector({ value, onChange, className }: DateTypeSelectorProps) {
  return (
    <div className={cn('grid w-full gap-2', className)}>
      <Label className="ml-1 text-base font-semibold text-gray-700">날짜 유형 선택</Label>

      <div className="mx-2 flex gap-4">
        <SelectCardButton
          icon={Repeat}
          title="매주 반복"
          description="요일 기준 선택"
          isActive={value === 'weekly'}
          onClick={() => onChange('weekly')}
        />
        <SelectCardButton
          icon={Calendar}
          title="특정 날짜"
          description="날짜 직접 선택"
          isActive={value === 'date'}
          onClick={() => onChange('date')}
        />
      </div>
    </div>
  );
}
