import {
  type GetMyStartPlaceResponse,
  type UpdateMyStartPlaceRequest,
  type UpdateMyStartPlaceResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

//내 출발지 조회
//요청 X
//반환 GetMyStartPlaceResponse
export const getMyStartPlace = async (
  code: string,
  id: string,
): Promise<GetMyStartPlaceResponse> => {
  const { data } = await axiosInstance.get<GetMyStartPlaceResponse>(
    `/meetings/${code}/my-places/${id}`,
  );
  return data;
};

//내 출발지 수정
//요청 UpdateMyStartPlaceRequest
//반환 UpdateMyStartPlaceResponse
export const updateMyStartPlace = async (
  code: string,
  id: string,
  body: UpdateMyStartPlaceRequest,
): Promise<UpdateMyStartPlaceResponse> => {
  const { data } = await axiosInstance.post<UpdateMyStartPlaceResponse>(
    `/meetings/${code}/my-places/${id}`,
    body,
  );
  return data;
};
