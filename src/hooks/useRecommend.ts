import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { recommendKeys } from './queryKeys';

import {
  getRecommendPlace,
  getRecommendResult,
  getRecommendTime,
} from '@/features/api/recommendApi';

//추천 시간 조회
export const useRecommendTime = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: recommendKeys.time(code!, token),
    queryFn: () => getRecommendTime(code!),
    enabled: !!code,
    refetchInterval: 10000,
  });
};

//추천 장소 조회
export const useRecommendPlace = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: recommendKeys.place(code!, token),
    queryFn: () => getRecommendPlace(code!),
    enabled: !!code,
    refetchInterval: 10000,
  });
};

//추천 결과 조회
export const useRecommendResult = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기
  return useQuery({
    queryKey: recommendKeys.result(code!, token),
    queryFn: () => getRecommendResult(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 1,
    refetchInterval: 4000,
  });
};
