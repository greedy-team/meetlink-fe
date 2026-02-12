import {
  type GetMyAvailableTimeResponse,
  type UpdateMyAvailableTimeRequest,
  type UpdateMyAvailableTimeResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

export const getMyAvailableTime = async (
  code: string,
  id: string,
): Promise<GetMyAvailableTimeResponse> => {
  const { data } = await axiosInstance.get<GetMyAvailableTimeResponse>(
    `/meetings/${code}/time-availability/${id}`,
  );
  return data;
};

export const updateMyAvailableTime = async (
  code: string,
  id: string,
  body: UpdateMyAvailableTimeRequest,
): Promise<UpdateMyAvailableTimeResponse> => {
  const { data } = await axiosInstance.post<UpdateMyAvailableTimeResponse>(
    `/meetings/${code}/time-availability/${id}`,
    body,
  );
  return data;
};
