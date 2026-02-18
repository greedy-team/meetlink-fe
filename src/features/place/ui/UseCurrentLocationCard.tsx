import { ChevronRight, Navigation } from 'lucide-react';

type Props = {
  onClick: () => void;
};

export function UseCurrentLocationCard({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl bg-emerald-50 px-4 py-4"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100">
          <Navigation className="h-5 w-5 text-emerald-700" />
        </div>
        <span className="text-base font-semibold text-emerald-800">현재 위치 사용</span>
      </div>

      <ChevronRight className="h-5 w-5 text-emerald-700/60" />
    </button>
  );
}
