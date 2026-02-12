export const meetingKeys = {
  all: ['meetings'] as const,

  detail: (code: string) => [...meetingKeys.all, 'detail', code] as const,
};

export const participantKeys = {
  all: ['participants'] as const,
  list: (code: string) => [...participantKeys.all, 'list', code] as const,
  status: (code: string, id: string) => [...participantKeys.all, 'status', code, id] as const,
};
