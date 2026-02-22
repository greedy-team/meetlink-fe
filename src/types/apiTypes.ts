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
  status: true;
}

////////////////////////////////////////////////////////////time
// 가능 시간 조회
export interface GetMyAvailableTimeResponse {
  code: string;

  myTimeList: SelectedTime[];
}

//가능 시간 등록
export interface UpdateMyAvailableTimeRequest {
  slots: {
    date?: string;
    dayOfWeek?: number;
    startTime: string;
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
  latitude: string; //위도
  longitude: string; //경도
}

export interface UpdateMyStartPlaceResponse {
  status: boolean;
  code?: string;
  message?: string;
  result?: {
    latitude: string;
  };
}

////////////////////////////////////////////////////////////recommend
//추천 시간 조회
export interface GetRecommendTimeResponse {
  status: true;
  result: {
    heatmaps: {
      date: string;
      dayOfWeek: number;
      slots: {
        startTime: string;
        availableCount: number;
      }[];
    };
    candidates: {
      availableCount: number;
      date: string;
      dayOfWeek: number;
      endTime: string;
      id: number;
      rank: number;
      startTime: string;
    }[];
  };
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
    timeCandidate: {
      id: number;
      date: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      availableCount: number;
      rank: number;
    };
    placeCandidate: {
      id: number;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      avgTravelTime: number;
      maxTravelTime: number;
      calculationType: string;
      rank: number;
    };
    createdAt: string;
    updatedAt: string;
  };
  code: string;
  message: string;
}
