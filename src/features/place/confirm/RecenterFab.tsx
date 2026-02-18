import { Crosshair } from 'lucide-react';

type Props = {
  onClick: () => void;
};

export function RecenterFab({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-6 bottom-6 grid h-14 w-14 place-items-center rounded-full bg-white shadow-lg"
      aria-label="recenter"
    >
      <Crosshair className="h-6 w-6 text-gray-900" />
    </button>
  );
}
