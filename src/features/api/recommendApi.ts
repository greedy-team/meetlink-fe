import {
  type GetRecommendPlaceResponse,
  type GetRecommendTimeResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

//추천 시간 조회
//요청 X
//반환 GetRecommendTimeResponse
export const getRecommendTime = async (code: string): Promise<GetRecommendTimeResponse> => {
  const { data } = await axiosInstance.get<GetRecommendTimeResponse>(
    `/meetings/${code}/time-recommendations`,
  );
  return data;
};

//추천 장소 조회
//요청 X
//반환 GetRecommendTimeResponse
export const getRecommendPlace = async (code: string): Promise<GetRecommendPlaceResponse> => {
  const { data } = await axiosInstance.get<GetRecommendPlaceResponse>(
    `/meetings/${code}/place-recommendations`,
  );
  return data;
};
