import { SearchField } from '@/features/place/ui/SearchField';

type Props = {
  placeholder?: string;
  onClick: () => void;
  disabled?: boolean;
};

export function PlaceSearchBar({ placeholder, onClick, disabled }: Props) {
  return (
    <SearchField mode="button" placeholder={placeholder} onClick={onClick} disabled={disabled} />
  );
}
