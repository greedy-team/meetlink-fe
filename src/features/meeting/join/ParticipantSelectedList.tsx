type Participant = {
  id: string;
  nickname: string;
};

type ParticipantSelectedListProps = {
  participants: Participant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ParticipantSelectedList({
  participants,
  selectedId,
  onSelect,
}: ParticipantSelectedListProps) {
  return (
    <div>
      <div className="text-base font-bold">
        참여자 목록 <span className="text-muted-foreground">({participants.length}명)</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {participants.map((p) => {
          const active = p.id === selectedId;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={[
                'w-full rounded-xl px-4 py-3 text-center transition-colors',
                active
                  ? 'border border-[#0B5A2A]/10 bg-[#E7F3EC] ring-1 ring-[#0B5A2A]/20'
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
