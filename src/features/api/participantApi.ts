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

export const getParticipantList = async (code: string): Promise<GetParticipantListResponse> => {
  const { data } = await axiosInstance.get<GetParticipantListResponse>(
    `/meetings/${code}/participants`,
  );
  return data;
};

export const getMyStatus = async (code: string, id: string): Promise<GetMyStatusResponse> => {
  const { data } = await axiosInstance.get<GetMyStatusResponse>(
    `/meetings/${code}/participants/${id}`,
  );
  return data;
};

export const leaveMeeting = async (code: string, id: string): Promise<LeaveMeetingResponse> => {
  const { data } = await axiosInstance.delete<LeaveMeetingResponse>(
    `/meetings/${code}/participants/${id}`,
  );
  return data;
};
