import {
  type GetMyStatusResponse,
  type GetParticipantListResponse,
  type JoinMeetingRequest,
  type JoinMeetingResponse,
  type LeaveMeetingResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

//
//요청 JointMeetingRequest
//반환 JoinMeetingResponse
export const joinMeeting = async (
  code: string,
  body: JoinMeetingRequest,
): Promise<JoinMeetingResponse> => {
  const { data } = await axiosInstance.post<JoinMeetingResponse>(
    `/meetings/${code}/participants`,
    body,
  );
  return data;
};

//참가자 목록 조회
//요청 X
//반환 GetParticipantListResponse
export const getParticipantList = async (code: string): Promise<GetParticipantListResponse> => {
  const { data } = await axiosInstance.get<GetParticipantListResponse>(
    `/meetings/${code}/participants`,
  );
  return data;
};

//내 상태 조회
//요청 X
//반환 GetMyStatusResponse
export const getMyStatus = async (code: string, id: string): Promise<GetMyStatusResponse> => {
  const { data } = await axiosInstance.get<GetMyStatusResponse>(
    `/meetings/${code}/participants/${id}`,
  );
  return data;
};

//모임 나가기
//요청 X
//반환 LeaveMeetingResponse
export const leaveMeeting = async (code: string, id: string): Promise<LeaveMeetingResponse> => {
  const { data } = await axiosInstance.delete<LeaveMeetingResponse>(
    `/meetings/${code}/participants/${id}`,
  );
  return data;
};
