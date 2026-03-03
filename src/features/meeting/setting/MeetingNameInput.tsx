import { useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };
  return (
    <div ref={containerRef} className={cn('mb-2 grid w-full items-center gap-2', className)}>
      <Label htmlFor="meeting-name" className="ml-1 text-base font-semibold text-gray-700">
        모임 이름
      </Label>

      <Input
        type="text"
        id="meeting-name"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={cn(
          'bg-background h-12 w-full rounded-xl border border-gray-200 px-4 text-base shadow-none outline-none',
          'placeholder:text-muted-foreground',
          'focus-visible:ring-greedy/20 focus-visible:border-greedy focus-visible:ring-2 focus-visible:ring-offset-0',
        )}
      />
    </div>
  );
}
