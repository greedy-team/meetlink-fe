import { axiosInstance } from '../axiosInstance';
import { type UpdateMeetingDetailRequest, type UpdateMeetingDetailResponse } from '../types';

export const UpdateMeetingDetail = async (
  code: string,
  body: UpdateMeetingDetailRequest,
): Promise<UpdateMeetingDetailResponse> => {
  const { data } = await axiosInstance.patch<UpdateMeetingDetailResponse>(
    `/meetings/${code}`,
    body,
  );
  return data;
};
