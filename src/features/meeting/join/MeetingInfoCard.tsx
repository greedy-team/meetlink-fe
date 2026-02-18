type MeetingInfoCardProps = {
  title: string;
  participantSummary?: string; // 예: "민수 외 3명 참여 중"
};

export function MeetingInfoCard({ title, participantSummary }: MeetingInfoCardProps) {
  return (
    <div className="rounded-2xl bg-[#E7F3EC] px-6 py-6">
      <div className="text-2xl font-extrabold text-[#0B5A2A]">{title}</div>

      {participantSummary && (
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
          <img src="/icons/participants.svg" alt="" aria-hidden="true" className="h-4 w-4" />
          <span>{participantSummary}</span>
        </div>
      )}
    </div>
  );
}
