import { cn } from '@/lib/utils';

type Participant = {
  nickname: string;
};

type ParticipantSelectedListProps = {
  participants: Participant[];
  selectedNickname: string | null;
  onSelect: (nickname: string) => void;
  isLoading?: boolean;
};

export function ParticipantSelectedList({
  participants,
  selectedNickname,
  onSelect,
  isLoading = false,
}: ParticipantSelectedListProps) {
  return (
    <div>
      <div
        className={cn(
          'text-base font-bold',
          isLoading ? 'w-32 rounded-lg bg-gray-100 text-gray-100' : '',
        )}
      >
        참여자 목록{' '}
        <span className={cn(isLoading ? 'hidden' : 'text-muted-foreground')}>
          ({participants.length}명)
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            ))
          : participants.map((p) => {
              const active = p.nickname === selectedNickname;

              return (
                <button
                  key={p.nickname}
                  type="button"
                  onClick={() => onSelect(p.nickname)}
                  className={[
                    'w-full cursor-pointer rounded-xl px-4 py-3 text-center transition-colors',
                    active
                      ? 'border-greedy/10 ring-greedy/20 bg-greedy/10 border ring-1'
                      : 'border-muted hover:bg-muted/40 border-2',
                  ].join(' ')}
                >
                  {p.nickname}
                </button>
              );
            })}
      </div>
    </div>
  );
}
