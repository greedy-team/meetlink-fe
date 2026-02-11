//모임 생성
export interface CreateMeetingResponse {
  code: string;

  success: boolean;
}

//모임 정보 요청
export interface GetMeetingDetailResponse {
  code: string;

  meetingName: string;
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  dateType: string;
  timeRange: string;
}

//모임 정보 수정
export interface UpdateMeetingDetailRequest {
  code: string;

  meetingName: string;
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  dateType: string;
  timeRange: string;
}

export interface UpdateMeetingDetailResponse {
  code: string;

  success: boolean;
}

//모임 참여

//모임 참여자 목록 조회

//내 참여 상태 확인

//모임 나가기
