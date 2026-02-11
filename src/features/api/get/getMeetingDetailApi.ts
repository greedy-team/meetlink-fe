import { axiosInstance } from '../axiosInstance';
import { type GetMeetingDetailResponse } from '../types';

export const getMeetingDetail = async (): Promise<GetMeetingDetailResponse> => {
  const { data } = await axiosInstance.get<GetMeetingDetailResponse>('/meetings');
  return data;
};
