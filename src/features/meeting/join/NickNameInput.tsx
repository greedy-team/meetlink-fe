import type { ChangeEvent } from 'react';

type NickNameInputProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  isLoading?: boolean;
};

export function NickNameInput({
  value,
  onChange,
  required = true,
  disabled,
  error,
  isLoading = false,
}: NickNameInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isOverLength = value.length > 10;
  const hasError = Boolean(error) || isOverLength;

  return (
    <div className="mt-6">
      <label className="text-base font-semibold">
        닉네임{required ? <span className="text-destructive">*</span> : null}
      </label>

      <div className="mt-2">
        <input
          value={value}
          onChange={handleChange}
          disabled={disabled || isLoading}
          placeholder="모임에서 사용할 닉네임을 입력해주세요"
          className={[
            'h-12 w-full rounded-xl border px-4 text-base outline-none',
            !isLoading ? 'bg-background placeholder:text-muted-foreground' : '',
            hasError && !isLoading
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20 focus:ring-2'
              : !isLoading
                ? 'focus:border-greedy focus:ring-greedy/20 focus:ring-2'
                : '',
            disabled && !isLoading ? 'opacity-60' : '',
            isLoading
              ? 'pointer-events-none border-transparent bg-gray-100 text-transparent placeholder:text-transparent'
              : '',
          ].join(' ')}
        />
      </div>

      {hasError && !isLoading ? (
        <p className="text-destructive mt-2 ml-1 text-xs">
          {isOverLength ? '최대 10자까지 입력할 수 있어요.' : error}
        </p>
      ) : null}
    </div>
  );
}
