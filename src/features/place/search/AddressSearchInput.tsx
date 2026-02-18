import { SearchField } from '@/features/place/ui/SearchField';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function AddressSearchInput({ value, onChange, placeholder, disabled }: Props) {
  return (
    <SearchField
      mode="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      clearable
    />
  );
}
