import { Calendar, Repeat } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { SelectCardButton } from './SelectCardButton';
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
