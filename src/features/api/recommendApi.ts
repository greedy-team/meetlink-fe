import {
  type GetRecommendPlaceResponse,
  type GetRecommendTimeResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

export const getRecommendTime = async (code: string): Promise<GetRecommendTimeResponse> => {
  const { data } = await axiosInstance.get<GetRecommendTimeResponse>(
    `/meetings/${code}/time-recommendations`,
  );
  return data;
};

export const getRecommendPlace = async (code: string): Promise<GetRecommendPlaceResponse> => {
  const { data } = await axiosInstance.get<GetRecommendPlaceResponse>(
    `/meetings/${code}/place-recommendations`,
  );
  return data;
};
