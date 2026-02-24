import { Calendar, Repeat } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { SelectCardButton } from './SelectCardButton';
type DateTypeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DateTypeSelector({ value, onChange }: DateTypeSelectorProps) {
  return (
    <div className={cn('w-full gap-2')}>
      <Label className="ml-2 text-base font-semibold text-gray-700">날짜 유형 선택</Label>

      <div className="flex gap-1">
        <SelectCardButton
          icon={Repeat}
          title="매주 반복"
          description="요일 기준 선택"
          isActive={value === 'WEEKLY'}
          onClick={() => onChange('WEEKLY')}
        />
        <SelectCardButton
          icon={Calendar}
          title="특정 날짜"
          description="날짜 직접 선택"
          isActive={value === 'SPECIFIC_DATE'}
          onClick={() => onChange('SPECIFIC_DATE')}
        />
      </div>
    </div>
  );
}
