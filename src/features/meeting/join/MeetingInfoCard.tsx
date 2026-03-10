import { Users } from 'lucide-react';

type MeetingInfoCardProps = {
  title: string;
  participantSummary?: string; // 예: "민수 외 3명 참여 중"
  isLoading?: boolean;
};

export function MeetingInfoCard({ title, participantSummary, isLoading }: MeetingInfoCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl bg-gray-100 px-6 py-6">
        <div className="h-8 w-2/3 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-1/3 rounded-lg bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="bg-greedy/10 rounded-2xl px-6 py-6">
      <div className="text-greedy-strong text-2xl font-extrabold">{title}</div>

      {participantSummary && (
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>{participantSummary}</span>
        </div>
      )}
    </div>
  );
}
