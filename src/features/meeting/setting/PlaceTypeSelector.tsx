import { Calendar, Repeat } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { SelectCardButton } from './SelectCardButton';
type PlaceTypeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PlaceTypeSelector({ value, onChange }: PlaceTypeSelectorProps) {
  return (
    <div className={cn('w-full gap-2')}>
      <Label className="text-greedy text-base font-semibold">장소 유형 선택</Label>

      <div className="flex gap-1">
        <SelectCardButton
          icon={Repeat}
          title="공평한 만남"
          description="이동 시간 편차를 최소화해요"
          isSelected={value === 'FAIR'}
          onClick={() => onChange('FAIR')}
        />
        <SelectCardButton
          icon={Calendar}
          title="빠른 만남"
          description="전체 이동 시간을 최소화해요"
          isSelected={value === 'FAST'}
          onClick={() => onChange('FAST')}
          isDisable={true}
        />
      </div>
    </div>
  );
}
