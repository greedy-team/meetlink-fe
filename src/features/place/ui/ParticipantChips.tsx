import { Clock } from 'lucide-react';

import type { ParticipantMovement } from '@/types/meetingTypes';

type ParticipantChipsProps = {
  movements: ParticipantMovement[];
  selectedNickName: string | null;
  onChangeSelected: (next: string | null) => void;
};

export function ParticipantChips({
  movements,
  selectedNickName,
  onChangeSelected,
}: ParticipantChipsProps) {
  return (
    <section className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {movements.map((m) => {
          const isSelected = selectedNickName === m.nickName;

          return (
            <button
              key={m.nickName}
              type="button"
              onClick={() => onChangeSelected(isSelected ? null : m.nickName)}
              className={[
                'min-w-23 shrink-0 rounded-2xl border bg-white px-2 py-1 shadow-sm first:ml-4 last:mr-4',
                isSelected ? 'border-greedy' : 'border-gray-200',
              ].join(' ')}
            >
              <div className="text-xs font-medium text-gray-600">{m.nickName}</div>

              <div className="text-greedy mt-1 flex items-center justify-center gap-1 text-sm font-semibold">
                <Clock size={14} strokeWidth={2} />
                <span>{m.takenTime}분</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
