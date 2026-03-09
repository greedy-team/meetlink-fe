import React, { type ReactNode } from 'react';

import { CheckCircle2, type LucideIcon, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SettingInfoCardProps {
  isEnabled: boolean;
  isLoading: boolean;
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
}

export const SettingInfoCard = ({
  isEnabled,
  isLoading,
  icon: Icon,
  title,
  children,
}: SettingInfoCardProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              isEnabled ? 'bg-greedy/10 text-greedy' : 'bg-gray-200/70 text-gray-400',
              isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : '',
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={cn(
              'text-base font-semibold text-gray-800',
              isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : '',
            )}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isEnabled ? (
            <>
              <CheckCircle2
                className={cn(
                  'text-greedy h-5 w-5',
                  isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : '',
                )}
              />
              <span
                className={cn(
                  'text-greedy text-sm font-medium',
                  isLoading ? 'rounded-lg bg-gray-100 text-gray-100' : '',
                )}
              >
                사용
              </span>
            </>
          ) : (
            <>
              <XCircle
                className={cn(
                  'h-5 w-5 text-gray-400',
                  isLoading ? 'rounded-xl bg-gray-100 text-gray-100' : '',
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium text-gray-500',
                  isLoading ? 'rounded-xl bg-gray-100 text-gray-100' : '',
                )}
              >
                사용 안 함
              </span>
            </>
          )}
        </div>
      </div>
      {isEnabled && children}
    </div>
  );
};
