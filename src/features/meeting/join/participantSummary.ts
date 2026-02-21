export function buildParticipantSummary(participants: Array<{ nickName: string }>) {
  const participantsNum = participants.length;
  if (!participantsNum) return undefined;

  const first = participants[0]?.nickName?.trim();
  if (!first) return `${participantsNum}명 참여 중`;

  return participantsNum > 1 ? `${first} 외 ${participantsNum - 1}명 참여 중` : `${first} 참여 중`;
}
