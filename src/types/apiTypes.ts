import {
  type ParticipantList,
  type RecommendPlace,
  type RecommendTime,
  type SelectedTime,
} from '@/types/meetingTypes';

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
  nickName: string;
}

export interface JoinMeetingResponse {
  code: string;

  success: boolean;
}

//모임 참여자 목록 조회
export interface GetParticipantListResponse {
  code: string;

  participantList: ParticipantList;
}

//내 참여 상태 확인
export interface GetMyStatusResponse {
  code: string;

  isFirstVisit: boolean;
}

//모임 나가기

export interface LeaveMeetingResponse {
  code: string;

  success: boolean;
}
////////////////////////////////////////////////////////////time
// 가능 시간 조회
export interface GetMyAvailableTimeResponse {
  code: string;

  myTimeList: SelectedTime[];
}

//가능 시간 등록
export interface UpdateMyAvailableTimeRequest {
  myTimeList: SelectedTime[];
}

export interface UpdateMyAvailableTimeResponse {
  code: string;

  success: boolean;
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
  code: string;

  success: boolean;
}

////////////////////////////////////////////////////////////recommend
//추천 시간 조회
export interface GetRecommendTimeResponse {
  code: string;

  commonTimeList: SelectedTime[];
  recommendTimeList: RecommendTime[];
}

//추천 장소 조회

export interface GetRecommendPlaceResponse {
  recommendPlaceList: RecommendPlace[];
}
