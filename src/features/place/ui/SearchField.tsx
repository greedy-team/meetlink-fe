import { Search, X } from 'lucide-react';

type Mode = 'button' | 'input';

type Props = {
  mode: Mode;
  placeholder?: string;
  disabled?: boolean;

  // input mode
  value?: string;
  onChange?: (v: string) => void;

  // button mode
  onClick?: () => void;

  // optional
  clearable?: boolean;
};

export function SearchField({
  mode,
  placeholder = '주소 또는 장소를 검색하세요',
  disabled,

  value = '',
  onChange,

  onClick,

  clearable = true,
}: Props) {
  const base = [
    'bg-background h-12 w-full rounded-xl border px-4 text-base',
    'flex items-center gap-3',
    'placeholder:text-muted-foreground',
    disabled ? 'opacity-60' : '',
  ].join(' ');

  const focusRing = 'focus-within:border-greedy focus-within:ring-2 focus-within:ring-greedy/20';

  if (mode === 'button') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          base,
          'cursor-pointer text-left',
          'focus:border-greedy focus:ring-greedy/20 focus:ring-2',
          !disabled ? 'hover:bg-gray-50' : '',
        ].join(' ')}
      >
        <Search className="h-5 w-5 shrink-0 text-gray-400" />
        <span className="truncate text-gray-500">{placeholder}</span>
      </button>
    );
  }

  // mode === 'input'
  const hasValue = value.trim().length > 0;

  return (
    <div className={[base, focusRing].join(' ')}>
      <Search className="h-5 w-5 shrink-0 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent outline-none"
      />
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full hover:bg-gray-100"
          aria-label="clear"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
