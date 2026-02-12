export const meetingKeys = {
  all: ['meetings'] as const,

  detail: (code: string) => [...meetingKeys.all, 'detail', code] as const,
};

export const participantKeys = {
  all: ['participants'] as const,

  list: (code: string) => [...participantKeys.all, 'list', code] as const,
  status: (code: string, id: string) => [...participantKeys.all, 'status', code, id] as const,
};

export const timeKeys = {
  all: ['times'] as const,

  my: (code: string, id: string) => [...timeKeys.all, code, id] as const,
};

export const placeKeys = {
  all: ['places'] as const,

  my: (code: string, id: string) => [...placeKeys.all, code, id] as const,
};

export const recommendKeys = {
  all: ['recommend'] as const,

  time: (code: string) => [...recommendKeys.all, 'time', code] as const,
  place: (code: string) => [...recommendKeys.all, 'place', code] as const,
};
