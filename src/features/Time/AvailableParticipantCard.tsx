import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInputType } from '@/hooks/useInputType';

interface AvailableParticipantCardProps {
  children: React.ReactNode; // 트리거가 될 버튼이나 요소
  content: React.ReactNode; // 옆에 띄울 카드 내용
  side?: 'top' | 'right' | 'bottom' | 'left'; // 카드 띄울 방향
  mode: string;
  isActivate: boolean;
}

export function AvailableParticipantCard({
  children,
  content,
  side = 'right',
  mode,
  isActivate,
}: AvailableParticipantCardProps) {
  const inputType = useInputType();
  if (mode === 'INPUT' || isActivate === false) return children;
  const contentClasses = 'w-fit min-w-0 max-w-[90vw] p-2';

  if (inputType === 'mouse') {
    return (
      <HoverCard openDelay={0} closeDelay={100}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent side={side} className={contentClasses}>
          {content}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side} className={contentClasses}>
        {content}
      </PopoverContent>
    </Popover>
  );
}
