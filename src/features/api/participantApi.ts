import {
  type DeletePushTokenResponse,
  type GetMyStatusResponse,
  type GetParticipantListResponse,
  type JoinMeetingRequest,
  type JoinMeetingResponse,
  type LeaveMeetingResponse,
  type RegisterPushTokenRequest,
  type RegisterPushTokenResponse,
  type TransferHostRequest,
  type TransferHostResponse,
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
export const getMyStatus = async (code: string): Promise<GetMyStatusResponse> => {
  const { data } = await axiosInstance.get<GetMyStatusResponse>(
    `/meetings/${code}/participants/me`,
  );
  return data;
};

//모임장 양도
export const transferHost = async (
  code: string,
  body: TransferHostRequest,
): Promise<TransferHostResponse> => {
  const { data } = await axiosInstance.post<TransferHostResponse>(
    `/meetings/${code}/participants/host`,
    body,
  );
  return data;
};

//모임 나가기
//요청 X
//반환 LeaveMeetingResponse
export const leaveMeeting = async (code: string): Promise<LeaveMeetingResponse> => {
  const { data } = await axiosInstance.delete<LeaveMeetingResponse>(
    `/meetings/${code}/participants/me`,
  );
  return data;
};

//푸시 토큰 등록
export const registerPushToken = async (
  code: string,
  body: RegisterPushTokenRequest,
): Promise<RegisterPushTokenResponse> => {
  const { data } = await axiosInstance.post<RegisterPushTokenResponse>(
    `/meetings/${code}/participants/me/push-token`,
    body,
  );
  return data;
};

// 푸시 토큰 삭제
export const deletePushToken = async (code: string): Promise<DeletePushTokenResponse> => {
  const { data } = await axiosInstance.delete<DeletePushTokenResponse>(
    `/meetings/${code}/participants/me/push-token`,
  );
  return data;
};
