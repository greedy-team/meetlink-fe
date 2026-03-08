import { ChevronRight, Navigation } from 'lucide-react';

type Props = {
  onClick: () => void;
};

export function UseCurrentLocationCard({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-greedy/10 flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-4"
    >
      <div className="flex items-center gap-3">
        <div className="bg-greedy/20 grid h-10 w-10 place-items-center rounded-lg">
          <Navigation className="text-greedy h-5 w-5" />
        </div>
        <span className="text-greedy-strong text-base font-semibold">현재 위치 사용</span>
      </div>

      <ChevronRight className="text-greedy h-5 w-5" />
    </button>
  );
}
