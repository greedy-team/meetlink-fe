import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Bell, BellOff, ChevronLeft, LogOut, Settings } from 'lucide-react';

import { isIosSafari } from '@/lib/device';
import { cn } from '@/lib/utils';

import { LeaveButton } from '@/features/meeting/setting/LeaveButton';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showSettingButton?: boolean;
  showLeaveButton?: boolean;
  showNotificationButton?: boolean;
  isPushEnabled?: boolean;
  onBack?: () => void;
  onLeave?: () => void;
  onNotificationClick?: () => void;
  onShowIosGuide?: () => void;
  className?: string;
};

export function Header({
  title,
  showBackButton = true,
  showSettingButton = false,
  showLeaveButton = false,
  showNotificationButton = false,
  isPushEnabled = false,
  onBack,
  onLeave = () => {},
  onNotificationClick = () => {},
  onShowIosGuide = () => {},
  className,
}: HeaderProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (title) {
      document.title = `${title} | MeetLink`;
    } else {
      document.title = 'MeetLink';
    }

    return () => {
      document.title = 'MeetLink';
    };
  }, [title]);

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  return (
    <header className="flex h-16 items-center border-b bg-white px-4">
      <div className="flex flex-1 items-center gap-2">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="flex cursor-pointer items-center"
            aria-label="이전 페이지로 이동"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <span className={cn('text-lg font-bold', className)}>{title}</span>
      </div>

      {showNotificationButton &&
        (isIosSafari() && !isPushEnabled && Notification.permission !== 'granted' ? (
          <button
            type="button"
            onClick={onShowIosGuide}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors"
          >
            <BellOff className="h-6 w-6 text-gray-400" />
          </button>
        ) : (
          <button
            key={isPushEnabled ? 'push-on' : 'push-off'}
            type="button"
            onClick={onNotificationClick}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors"
          >
            {isPushEnabled ? (
              <Bell className="h-6 w-6" />
            ) : (
              <BellOff className="h-6 w-6 text-gray-400" />
            )}
          </button>
        ))}

      {showSettingButton && (
        <button
          type="button"
          onClick={() => navigate('settings')}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center"
          aria-label="설정 페이지로 이동"
        >
          <Settings className="h-6 w-6" />
        </button>
      )}

      {showLeaveButton && (
        <LeaveButton onLeave={onLeave}>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center"
            aria-label="모임 나기기"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </LeaveButton>
      )}
    </header>
  );
}
