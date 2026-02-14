import type { ReactNode } from 'react';

type NotifyVariant = 'default' | 'emphasis';

type NotifyBoxProps = {
  variant?: NotifyVariant;
  children: ReactNode;
  className?: string;
};

export function NotifyBox({ variant = 'default', children, className }: NotifyBoxProps) {
  const iconSrc = variant === 'emphasis' ? '/icons/Info_green.svg' : '/icons/Info_gray.svg';

  const baseClassName = 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm leading-snug';

  const variantClassName =
    variant === 'emphasis' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700';

  return (
    <div
      className={[baseClassName, variantClassName, className ?? ''].join(' ')}
      role="status"
      aria-live="polite"
    >
      <img src={iconSrc} alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />

      <div className="flex-1">{children}</div>
    </div>
  );
}
