type Participant = {
  nickname: string;
};

type ParticipantSelectedListProps = {
  participants: Participant[];
  selectedNickname: string | null;
  onSelect: (nickname: string) => void;
};

export function ParticipantSelectedList({
  participants,
  selectedNickname,
  onSelect,
}: ParticipantSelectedListProps) {
  return (
    <div>
      <div className="text-base font-bold">
        참여자 목록 <span className="text-muted-foreground">({participants.length}명)</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {participants.map((p) => {
          const active = p.nickname === selectedNickname;

          return (
            <button
              key={p.nickname}
              type="button"
              onClick={() => onSelect(p.nickname)}
              className={[
                'w-full rounded-xl px-4 py-3 text-center transition-colors',
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
