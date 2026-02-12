import {
  type GetMyStartPlaceResponse,
  type UpdateMyStartPlaceRequest,
  type UpdateMyStartPlaceResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

export const getMyStartPlace = async (
  code: string,
  id: string,
): Promise<GetMyStartPlaceResponse> => {
  const { data } = await axiosInstance.get<GetMyStartPlaceResponse>(
    `/meetings/${code}/my-places/${id}`,
  );
  return data;
};

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
