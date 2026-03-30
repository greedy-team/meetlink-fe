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
      <Label className="text-greedy text-base font-semibold">날짜 유형 선택</Label>

      <div className="flex gap-1">
        <SelectCardButton
          icon={Repeat}
          title="매주 반복"
          description="요일을 기준으로 선택해요"
          isSelected={value === 'WEEKLY'}
          onClick={() => onChange('WEEKLY')}
        />
        <SelectCardButton
          icon={Calendar}
          title="특정 날짜"
          description="날짜를 직접 선택해요"
          isSelected={value === 'SPECIFIC_DATE'}
          onClick={() => onChange('SPECIFIC_DATE')}
        />
      </div>
    </div>
  );
}
