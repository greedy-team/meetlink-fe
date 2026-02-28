import { type RecommendPlace, type RecommendTime, type SelectedTime } from '@/types/meetingTypes';

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
    id: number;
    name: string;
    code: string;
    enableTimeRecommendation: boolean;
    enablePlaceRecommendation: boolean;
    timeAvailabilityType: string;
    timeRangeStart: string;
    timeRangeEnd: string;
    createdAt: string;
    updatedAt: string;
  };

  code?: string;
  message?: string;
}

//모임 정보 조회
export interface GetMeetingDetailResponse {
  status: boolean;

  result?: {
    id: number;
    name: string;
    code: string;
    enableTimeRecommendation: boolean;
    enablePlaceRecommendation: boolean;
    timeAvailabilityType: string;
    timeRangeStart: string;
    timeRangeEnd: string;
    createdAt: string;
    updatedAt: string;
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
    id: number;
    name: string;
    code: string;
    enableTimeRecommendation: boolean;
    enablePlaceRecommendation: boolean;
    timeAvailabilityType: string;
    timeRangeStart: string;
    timeRangeEnd: string;
    createdAt: string;
    updatedAt: string;
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
    nickname: string;
  };
  code?: string;
  message?: string;
}

//모임 참여자 목록 조회
export interface GetParticipantListResponse {
  status: boolean;
  result?: {
    id: number;
    nickname: string;
    placeSubmitted: boolean;
    timeSubmitted: boolean;
  }[];
}

//내 참여 상태 확인
export interface GetMyStatusResponse {
  status: true;
  result?: {
    id: number;
    nickname: string;
    placeSubmitted: boolean;
    timeSubmitted: boolean;
  };
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
    availabilities: {
      dayOfWeek: number;
      date: string;
      startTimes: string[];
    }[];
  };
  code: string;
  message: string;
}

//공통 시간 조회
export interface GetCommonAvailableTimeResponse {
  status: boolean;
  result: {
    heatmaps: {
      date: string;
      dayOfWeek: number;
      slots: {
        startTime: string;
        availableCount: number;
      }[];
    }[];
  };
  code: string;
  message: string;
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
  code: string;

  address: string;
  latitude: string; //위도
  longitude: string; //경도
}
//출발지 등록
export interface UpdateMyStartPlaceRequest {
  address: string;
  latitude: number; //위도
  longitude: number; //경도
}

export interface UpdateMyStartPlaceResponse {
  status: boolean;
  code?: string;
  message?: string;
  result?: Record<string, string>;
}

////////////////////////////////////////////////////////////recommend
//추천 시간 후보 조회
export interface GetRecommendTimeResponse {
  status: true;
  result: {
    id: number;
    date: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    availableCount: number;
    rank: number;
  }[];

  code: string;
  message: string;
}

//추천 장소 조회

export interface GetRecommendPlaceResponse {
  recommendPlaceList: RecommendPlace[];
}

//추천 결과 조회
export interface GetRecommendResultResponse {
  status: boolean;
  result: {
    id: number;
    placeCandidate: {
      address: string;
      avgTravelTime: number;
      id: number;
      latitude: number;
      longitude: number;
      maxTravelTime: number;
      name: string;
      rank: number;
    };
    timeCandidate: {
      availableCount: number;
      date: string;
      dayOfWeek: number;
      endTime: string;
      id: number;
      rank: number;
      startTime: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}
