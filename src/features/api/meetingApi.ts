import {
  type CreateMeetingResponse,
  type GetMeetingDetailResponse,
  type UpdateMeetingDetailRequest,
  type UpdateMeetingDetailResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

export const createMeeting = async (): Promise<CreateMeetingResponse> => {
  const { data } = await axiosInstance.post<CreateMeetingResponse>('/meetings');
  return data;
};

export const getMeetingDetail = async (code: string): Promise<GetMeetingDetailResponse> => {
  const { data } = await axiosInstance.get<GetMeetingDetailResponse>(`/meetings/${code}`);
  return data;
};

export const updateMeetingDetail = async (
  code: string,
  body: UpdateMeetingDetailRequest,
): Promise<UpdateMeetingDetailResponse> => {
  const { data } = await axiosInstance.patch<UpdateMeetingDetailResponse>(
    `/meetings/${code}`,
    body,
  );
  return data;
};
