//쿼리 키 모음

//미팅 쿼리
export const meetingKeys = {
  all: ['meetings'] as const,

  detail: (code: string) => [...meetingKeys.all, 'detail', code] as const,
};

//참가자 쿼리
export const participantKeys = {
  all: ['participants'] as const,
  list: (code: string, token: string | null) =>
    [...participantKeys.all, 'list', code, token] as const,
  status: (code: string, token: string | null) =>
    [...participantKeys.all, 'status', code, token] as const,
};

//시간 쿼리 (토큰 추가)
export const timeKeys = {
  all: ['times'] as const,
  my: (code: string, token: string | null) => [...timeKeys.all, code, token] as const,
  whole: (code: string, token: string | null) => [...timeKeys.all, code, token] as const,
};

//장소 쿼리 (토큰 추가)
export const placeKeys = {
  all: ['places'] as const,
  my: (code: string, token: string | null) => [...placeKeys.all, code, token] as const,
};

//추천 쿼리
export const recommendKeys = {
  all: ['recommend'] as const,

  time: (code: string, token: string | null) =>
    [...recommendKeys.all, 'time', code, token] as const,
  place: (code: string, token: string | null) =>
    [...recommendKeys.all, 'place', code, token] as const,
  result: (code: string, token: string | null) =>
    [...recommendKeys.all, 'result', code, token] as const,
};
