import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type MeetingNameInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

export function MeetingNameInput({
  value = '',
  onChange,
  placeholder = '예: 동아리 정기 모임',
  className,
}: MeetingNameInputProps) {
  return (
    <div className={cn('grid w-full items-center gap-2', className)}>
      <Label htmlFor="meeting-name" className="ml-1 text-base font-semibold text-gray-700">
        모임 이름
      </Label>

      <Input
        type="text"
        id="meeting-name"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="focus-visible:ring-greedy h-12 rounded-xl border-gray-200 bg-white text-base"
      />
    </div>
  );
}
