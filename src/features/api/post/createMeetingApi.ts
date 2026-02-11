import { axiosInstance } from '../axiosInstance';
import { type CreateMeetingResponse } from './types';

export const createMeeting = async (): Promise<CreateMeetingResponse> => {
  const { data } = await axiosInstance.post<CreateMeetingResponse>('/meetings');
  return data;
};
