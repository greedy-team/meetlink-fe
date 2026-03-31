////////////////////////////////////////////////////////////meeting
//모임 생성

export interface CreateMeetingRequest {
  name: string;
  enableTimeRecommendation: boolean;
  enablePlaceRecommendation: boolean;
  timeAvailabilityType: string;
  timeRangeStart: string;
  timeRangeEnd: string; // "18:00:00"
}

export interface CreateMeetingResponse {
  status: boolean;

  result?: {
    name: string;
    code: string;
    enableTimeRecommendation: boolean;
    enablePlaceRecommendation: boolean;
    timeAvailabilityType: string;
    timeRangeStart: string;
    timeRangeEnd: string;
  };

  code?: string;
  message?: string;
}

//모임 정보 조회
export interface GetMeetingDetailResponse {
  status: boolean;

  result?: {
    name: string;
    code: string;
    enableTimeRecommendation: boolean;
    enablePlaceRecommendation: boolean;
    timeAvailabilityType: string;
    timeRangeStart: string;
    timeRangeEnd: string;
  };

  code?: string;
  message?: string;
}

//모임 정보 수정
export interface UpdateMeetingDetailRequest {
  name: string;
  enableTimeRecommendation: boolean;
  enablePlaceRecommendation: boolean;
  timeAvailabilityType: string;
  timeRangeStart: string;
  timeRangeEnd: string;
}

export interface UpdateMeetingDetailResponse {
  status: boolean;

  result?: {
    name: string;
    code: string;
    enableTimeRecommendation: boolean;
    enablePlaceRecommendation: boolean;
    timeAvailabilityType: string;
    timeRangeStart: string;
    timeRangeEnd: string;
  };

  code?: string;
  message?: string;
}

////////////////////////////////////////////////////////////participant
//모임 참여
export interface JoinMeetingRequest {
  nickname: string;
}

export interface JoinMeetingResponse {
  status: boolean;
  result?: {
    token: string;
  };
  code?: string;
  message?: string;
}

//모임 참여자 목록 조회
export interface GetParticipantListResponse {
  status: boolean;
  result?: {
    nickname: string;
    token?: string;
    isPlaceSubmitted?: boolean;
    isTimeSubmitted?: boolean;
    isHost: boolean;
  }[];
}

//내 참여 상태 확인
export interface GetMyStatusResponse {
  status: true;
  result?: {
    nickname: string;
    placeSubmitted: boolean;
    timeSubmitted: boolean;
    isHost: boolean;
  };
}

//모임장 양도
export interface TransferHostRequest {
  nickname: string;
}

export interface TransferHostResponse {
  status: boolean;
  code?: string;
  message?: string;
}

//모임 나가기

export interface LeaveMeetingResponse {
  status: boolean;
}

////////////////////////////////////////////////////////////time
// 내 가능 시간 조회
export interface GetMyAvailableTimeResponse {
  status: boolean;
  result: {
    dayOfWeek: number;
    date: string;
    startTimes: string[];
  }[];

  code?: string;
  message?: string;
}

//모든 시간 조회
export interface GetWholeAvailableTimeResponse {
  status: boolean;
  result: {
    availabilities: {
      date?: string;
      dayOfWeek?: number;
      startTimes: string[];
    }[];
    nickname: string;
  }[];

  code?: string;
  message?: string;
}

//가능 시간 등록
export interface UpdateMyAvailableTimeRequest {
  availabilities: {
    date?: string;
    dayOfWeek?: number;
    startTimes: string[];
  }[];
}

export interface UpdateMyAvailableTimeResponse {
  status: boolean;
  code?: string;
  message?: string;
}

////////////////////////////////////////////////////////////place
//출발지 조회
export interface GetMyStartPlaceResponse {
  status: true;
  result: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  code?: string;
  message?: string;
}

//출발지 등록
export interface UpdateMyStartPlaceRequest {
  name: string;
  address: string;
  latitude: number; //위도
  longitude: number; //경도
}

export interface UpdateMyStartPlaceResponse {
  status: boolean;
  result?: {
    latitude: string;
  };
  code?: string;
  message?: string;
}

////////////////////////////////////////////////////////////recommend
//추천 시간 후보 조회
export interface GetRecommendTimeResponse {
  status: boolean;
  result: {
    date: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    availableCount: number;
    rank: number;
  }[];

  code?: string;
  message?: string;
}

//추천 장소 조회

export interface GetRecommendPlaceResponse {
  status: boolean;
  result: {
    address: string;
    avgTravelTime: number;
    latitude: number;
    longitude: number;
    maxTravelTime: number;
    name: string;
    rank: number;
  }[];
}

//추천 결과 조회
export interface GetRecommendResultResponse {
  status: boolean;
  result: {
    timeCandidate: {
      calculationStatus: string;
      date?: string;
      dayOfWeek?: number;
      startTime?: string;
      endTime?: string;
      availableCount?: number;
      rank?: number;
    };
    placeCandidate: {
      calculationStatus: string;
      name?: string;
      address?: string;
      avgTravelTime?: number;
      latitude?: number;
      longitude?: number;
      maxTravelTime?: number;
      rank?: number;
    };
  };
  code?: string;
  message?: string;
}
