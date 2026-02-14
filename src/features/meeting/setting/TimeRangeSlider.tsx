'use client';

import * as React from 'react';

import * as SliderPrimitive from '@radix-ui/react-slider';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// 이미지의 스타일을 반영한 커스텀 슬라이더
const CustomSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none items-center select-none', className)}
    {...props}
  >
    {/* 전체 트랙 (회색 배경) */}
    <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-gray-100">
      {/* 선택된 범위 (녹색 채움) */}
      <SliderPrimitive.Range className="bg-greedy absolute h-full" />
    </SliderPrimitive.Track>

    {/* 첫 번째 핸들 (시작 시간) */}
    <SliderPrimitive.Thumb className="border-greedy ring-offset-background block h-7 w-7 rounded-full border-[3px] bg-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />

    {/* 두 번째 핸들 (종료 시간) */}
    <SliderPrimitive.Thumb className="border-greedy ring-offset-background block h-7 w-7 rounded-full border-[3px] bg-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
CustomSlider.displayName = SliderPrimitive.Root.displayName;

// 메인 컴포넌트
interface TimeRangeSliderProps {
  value: [number, number]; // [시작시간, 종료시간]
  onValueChange: (value: [number, number]) => void;
  className?: string;
}

export function TimeRangeSlider({ value, onValueChange, className }: TimeRangeSliderProps) {
  return (
    <div className={cn('flex w-full flex-col gap-3 px-1', className)}>
      <Label className="ml-1 text-base font-semibold text-gray-700">시간 범위 선택</Label>

      <div className="space-y-1">
        <div className="p-1">
          <CustomSlider
            defaultValue={[0, 24]}
            value={value}
            onValueChange={(val) => onValueChange(val as [number, number])}
            min={0}
            max={24}
            step={6}
            minStepsBetweenThumbs={1}
          />
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-500">
          <span className="w-10 text-center">0시</span>
          <span className="w-10 text-center">6시</span>
          <span className="w-10 text-center">12시</span>
          <span className="w-10 text-center">18시</span>
          <span className="w-10 text-center">24시</span>
        </div>
      </div>
    </div>
  );
}
