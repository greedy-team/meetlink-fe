import type { ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

type FixedBottomButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
};

export function FixedBottomButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'lg',
  className,
}: FixedBottomButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      className={['h-12 w-full rounded-xl text-base font-semibold', className ?? ''].join(' ')}
    >
      {/* 로딩 시 스피너 + 텍스트 */}
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
