import { useEffect, useRef } from 'react';

import { Check, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RecommendCheckBoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export function RecommendCheckBox({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  children,
}: RecommendCheckBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (checked) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [checked]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col rounded-3xl border-2 transition-all duration-200',
        checked ? 'border-greedy bg-greedy/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
      )}
    >
      <button
        className="flex w-full items-center justify-between p-4"
        type="button"
        onClick={() => onCheckedChange(!checked)}
      >
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <Icon //아이콘
              size={20}
              className={cn(
                'h-auto! w-auto! transition-colors',
                checked ? 'text-greedy' : 'text-gray-900',
              )}
            />
            <span //제목
              className={cn(
                'text-base font-bold transition-colors',
                checked ? 'text-greedy' : 'text-gray-900',
              )}
            >
              {title}
            </span>
          </div>
          <div //설명
            className="text-xs leading-tight font-medium whitespace-pre-wrap text-gray-400"
          >
            {description}
          </div>
        </div>

        <Check // 체크박스
          strokeWidth={4}
          size={30}
          className={cn(
            'ml-4 h-auto! w-auto! shrink-0 rounded-[15px] p-3 transition-colors',
            checked ? 'bg-[#CCE3D3] text-[#4A8B5F]' : 'bg-gray-200 text-transparent',
          )}
        />
      </button>
      {checked && <div className="mb-4 flex flex-col gap-5 border-t px-3 pt-4">{children}</div>}
    </div>
  );
}
