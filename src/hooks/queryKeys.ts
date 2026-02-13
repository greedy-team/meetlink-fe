//쿼리 키 모음

//미팅 쿼리
export const meetingKeys = {
  all: ['meetings'] as const,

  detail: (code: string) => [...meetingKeys.all, 'detail', code] as const,
};

//참가자 쿼리
export const participantKeys = {
  all: ['participants'] as const,

  list: (code: string) => [...participantKeys.all, 'list', code] as const,
  status: (code: string, id: string) => [...participantKeys.all, 'status', code, id] as const,
};

//시간 쿼리
export const timeKeys = {
  all: ['times'] as const,

  my: (code: string, id: string) => [...timeKeys.all, code, id] as const,
};

//장소 쿼리
export const placeKeys = {
  all: ['places'] as const,

  my: (code: string, id: string) => [...placeKeys.all, code, id] as const,
};

//추천 쿼리
export const recommendKeys = {
  all: ['recommend'] as const,

  time: (code: string) => [...recommendKeys.all, 'time', code] as const,
  place: (code: string) => [...recommendKeys.all, 'place', code] as const,
};
