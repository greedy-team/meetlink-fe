import { useRef } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type MeetingNameInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
};

export function MeetingNameInput({
  value = '',
  onChange,
  placeholder = '예: 동아리 정기 모임',
  className,
  isLoading = false,
}: MeetingNameInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const isOverLength = value.length > 15;

  return (
    <div ref={containerRef} className={cn('mb-2 grid w-full items-center gap-2', className)}>
      <Label htmlFor="meeting-name" className="text-base font-semibold">
        모임 이름
      </Label>

      <Input
        type="text"
        id="meeting-name"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          'bg-background h-12 w-full rounded-xl border px-4 text-base! shadow-none outline-none',
          'placeholder:text-muted-foreground',
          isOverLength
            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:ring-2 focus-visible:ring-offset-0'
            : 'focus-visible:border-greedy focus-visible:ring-greedy/20 border-gray-200 focus-visible:ring-2 focus-visible:ring-offset-0',
          isLoading && 'bg-gray-100 text-gray-100',
        )}
      />
      {/* 글자수 초과했을 경우 에러 스타일 문구 */}
      {isOverLength && (
        <p className="text-destructive ml-1 text-xs">최대 15자까지 입력할 수 있어요.</p>
      )}
    </div>
  );
}
