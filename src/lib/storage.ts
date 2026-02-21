const participantKey = (code: string) => `greedy:meeting:${code}:participantId`;

export const storage = {
  // 저장된 참여자 id 조회 (없으면 null)
  getParticipantId(code: string): string | null {
    return localStorage.getItem(participantKey(code));
  },

  // 참여자 id 저장
  setParticipantId(code: string, participantId: string) {
    localStorage.setItem(participantKey(code), participantId);
  },

  // 해당 모임의 참여 기록을 로컬에서 제거
  clearParticipantId(code: string) {
    localStorage.removeItem(participantKey(code));
  },
};
