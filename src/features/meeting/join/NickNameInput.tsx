import type { ChangeEvent } from 'react';

type NickNameInputProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

export function NickNameInput({
  value,
  onChange,
  required = true,
  disabled,
  error,
}: NickNameInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mt-6">
      <label className="text-sm font-semibold">
        닉네임{required ? <span className="text-destructive">*</span> : null}
      </label>

      <div className="mt-2">
        <input
          value={value}
          maxLength={10}
          onChange={handleChange}
          disabled={disabled}
          placeholder="모임에서 사용할 닉네임을 입력해주세요"
          className={[
            'bg-background h-12 w-full rounded-xl border px-4 text-base outline-none',
            'placeholder:text-muted-foreground',
            'focus:border-greedy focus:ring-greedy/20 focus:ring-2',
            disabled ? 'opacity-60' : '',
            error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : '',
          ].join(' ')}
        />
      </div>

      {error ? <p className="text-destructive mt-2 text-xs">{error}</p> : null}
    </div>
  );
}
