import type { ReactNode } from 'react';

type JoinOptionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
};

export function JoinOptionCard({
  icon,
  title,
  description,
  onClick,
  disabled,
}: JoinOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'bg-muted flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left',
        'transition-colors',
        disabled ? 'opacity-50' : 'hover:bg-muted/40',
      ].join(' ')}
    >
      <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-full">
        {icon}
      </div>

      <div className="flex-1">
        <div className="text-base font-bold">{title}</div>
        <div className="text-muted-foreground mt-1 text-sm">{description}</div>
      </div>

      <img src="/icons/chevron-right.svg" alt="" aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
