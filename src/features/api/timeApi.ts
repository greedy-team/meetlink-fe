import {
  type GetCommonAvailableTimeResponse,
  type GetMyAvailableTimeResponse,
  type UpdateMyAvailableTimeRequest,
  type UpdateMyAvailableTimeResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

//내 가능 시간 조회
//요청 X
//반환 GetMyAvailableTimeResponse
export const getMyAvailableTime = async (code: string): Promise<GetMyAvailableTimeResponse> => {
  const { data } = await axiosInstance.get<GetMyAvailableTimeResponse>(
    `/meetings/${code}/availabilities/time/me`,
  );
  return data;
};

export const getCommonAvailableTime = async (
  code: string,
): Promise<GetCommonAvailableTimeResponse> => {
  const { data } = await axiosInstance.get<GetCommonAvailableTimeResponse>(
    `/meetings/${code}/availabilities/time`,
  );
  return data;
};

//내 가능 시간 수정
//요청 UpdateMyAvailableTimeRequest
//반환 UpdateMyAvailableTImeResponse
export const updateMyAvailableTime = async (
  code: string,
  body: UpdateMyAvailableTimeRequest,
): Promise<UpdateMyAvailableTimeResponse> => {
  const { data } = await axiosInstance.post<UpdateMyAvailableTimeResponse>(
    `/meetings/${code}/availabilities/time`,
    body,
  );
  return data;
};
