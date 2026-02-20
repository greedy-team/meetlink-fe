import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

type Props = {
  selected: UpdateMyStartPlaceRequest | null;
};

export function SelectedPlaceSummary({ selected }: Props) {
  if (!selected) {
    return <div className="text-center text-sm text-gray-400">선택된 위치가 없습니다</div>;
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">선택된 위치</span>
      <span className="text-greedy-strong max-w-[70%] truncate text-sm font-semibold">
        {selected.address}
      </span>
    </div>
  );
}
