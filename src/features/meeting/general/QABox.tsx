import { ChevronRight, MessagesSquare } from 'lucide-react';

import { cn } from '@/lib/utils';

interface QABoxProps {
  isLoading?: boolean;
}

export function QABox({ isLoading = false }: QABoxProps) {
  const innerContent = (
    <>
      <div className="flex items-center gap-4 text-left">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors',
            isLoading ? 'bg-gray-100 text-gray-100' : 'bg-greedy/10 text-greedy',
          )}
        >
          <MessagesSquare size={24} />
        </div>

        <div className="flex flex-col gap-1">
          <span
            className={cn(
              'text-base leading-tight font-bold',
              isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : 'text-gray-900',
            )}
          >
            함께 만드는 MeetLink
          </span>
          <span
            className={cn(
              'text-xs leading-relaxed font-medium',
              isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : 'text-gray-400',
            )}
          >
            더 나은 MeetLink를 위해 여러분의 소중한 의견을 들려주세요
          </span>
        </div>
      </div>

      {!isLoading && (
        <div className="ml-4 flex h-11 shrink-0 items-center justify-center text-gray-500 transition-colors">
          <ChevronRight strokeWidth={3} className="h-6 w-6" />
        </div>
      )}
    </>
  );

  const wrapperClasses = cn(
    'group mt-2 flex w-full items-center justify-between rounded-3xl border-2 p-4 transition-all duration-200',
    'border-gray-200 bg-gray-50',
    !isLoading && 'cursor-pointer hover:bg-gray-100',
  );

  if (isLoading) {
    return <div className={wrapperClasses}>{innerContent}</div>;
  }

  return (
    <a
      href="https://www.instagram.com/meetlink.now/"
      target="_blank"
      rel="noopener noreferrer"
      className={wrapperClasses}
    >
      {innerContent}
    </a>
  );
}
