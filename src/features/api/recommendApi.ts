import {
  type GetRecommendPlaceResponse,
  type GetRecommendResultResponse,
  type GetRecommendTimeResponse,
} from '../../types/apiTypes';
import { axiosInstance } from './axiosInstance';

//추천 시간 조회
//요청 X
//반환 GetRecommendTimeResponse
export const getRecommendTime = async (code: string): Promise<GetRecommendTimeResponse> => {
  const { data } = await axiosInstance.get<GetRecommendTimeResponse>(
    `/meetings/${code}/candidates/time`,
  );
  return data;
};

export const calculateRecommendTime = async (code: string): Promise<GetRecommendTimeResponse> => {
  const { data } = await axiosInstance.post<GetRecommendTimeResponse>(
    `/meetings/${code}/candidates/time`,
  );
  return data;
};

//추천 장소 조회
//요청 X
//반환 GetRecommendTimeResponse
export const getRecommendPlace = async (code: string): Promise<GetRecommendPlaceResponse> => {
  const { data } = await axiosInstance.get<GetRecommendPlaceResponse>(
    `/meetings/${code}/candidates/place`,
  );
  return data;
};

export const calculateRecommendPlace = async (code: string): Promise<GetRecommendPlaceResponse> => {
  const { data } = await axiosInstance.post<GetRecommendPlaceResponse>(
    `/meetings/${code}/candidates/place`,
  );
  return data;
};

//추천 결과 조회
export const getRecommendResult = async (code: string): Promise<GetRecommendResultResponse> => {
  const { data } = await axiosInstance.get<GetRecommendResultResponse>(`/meetings/${code}/result`);
  return data;
};
