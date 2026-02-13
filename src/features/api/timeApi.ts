import {
  type GetMyAvailableTimeResponse,
  type UpdateMyAvailableTimeRequest,
  type UpdateMyAvailableTimeResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

//내 가능 시간 조회
//요청 X
//반환 GetMyAvailableTimeResponse
export const getMyAvailableTime = async (
  code: string,
  id: string,
): Promise<GetMyAvailableTimeResponse> => {
  const { data } = await axiosInstance.get<GetMyAvailableTimeResponse>(
    `/meetings/${code}/time-availability/${id}`,
  );
  return data;
};

//내 가능 시간 수정
//요청 UpdateMyAvailableTimeRequest
//반환 UpdateMyAvailableTImeResponse
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
