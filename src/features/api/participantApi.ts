import {
  type GetMyStatusRequest,
  type GetMyStatusResponse,
  type GetParticipantListResponse,
  type JoinMeetingRequest,
  type JoinMeetingResponse,
  type LeaveMeetingRequest,
  type LeaveMeetingResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

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

export const getMeetingDetail = async (code: string): Promise<GetParticipantListResponse> => {
  const { data } = await axiosInstance.get<GetParticipantListResponse>(
    `/meetings/${code}/participants`,
  );
  return data;
};

export const getMyStatus = async (
  code: string,
  body: GetMyStatusRequest,
): Promise<GetMyStatusResponse> => {
  const { data } = await axiosInstance.get<GetMyStatusResponse>(
    `/meetings/${code}/participants/me`,
    {
      params: body,
    },
  );
  return data;
};

export const leaveMeeting = async (
  code: string,
  body: LeaveMeetingRequest,
): Promise<LeaveMeetingResponse> => {
  const { data } = await axiosInstance.delete<LeaveMeetingResponse>(
    `/meetings/${code}/participants/me`,
    {
      data: body,
    },
  );
  return data;
};
