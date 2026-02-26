import React, { type ReactNode } from 'react';

import { CheckCircle2, type LucideIcon, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SettingInfoCardProps {
  isEnabled: boolean;
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
}

export const SettingInfoCard = ({
  isEnabled,
  icon: Icon,
  title,
  children,
}: SettingInfoCardProps) => {
  return (
    <div className="m-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              isEnabled ? 'bg-greedy/10 text-greedy' : 'bg-red-100 text-red-500',
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold text-gray-800">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isEnabled ? (
            <>
              <CheckCircle2 className="text-greedy/70 h-5 w-5" />
              <span className="text-greedy/70 text-sm font-medium">사용</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-gray-300" />
              <span className="text-sm font-medium text-red-500">사용 안 함</span>
            </>
          )}
        </div>
      </div>
      {isEnabled && children}
    </div>
  );
};
